"""
gradcam.py — Gradient-weighted Class Activation Mapping (Grad-CAM)
===================================================================

Implements Grad-CAM (Selvaraju et al. 2017) for spatial explainability of
multi-label chest X-ray predictions.

Reference: "Grad-CAM: Visual Explanations from Deep Networks via Gradient-based
           Localization" — https://arxiv.org/abs/1610.02391

HOW IT WORKS
------------
1. Forward pass: record the spatial feature maps A^k (h × w × C) from the
   target convolutional layer via a forward hook.
2. Backward pass for class c: record the gradients ∂y^c/∂A^k flowing back
   through that same layer via a backward hook.
3. Compute α^k_c = GlobalAveragePool(∂y^c/∂A^k)  — importance weight of
   feature map k for class c.
4. Produce heatmap: L^c_CAM = ReLU(Σ_k α^k_c · A^k)
   ReLU removes negative activations (features that suppress the predicted class).
5. Upsample L^c_CAM to input image resolution and normalize 0–1.

MULTI-LABEL NOTE
----------------
Unlike single-label classification, we backpropagate for one class at a time
(the class we want to explain), keeping all other class logits detached.
This means a separate Grad-CAM pass is needed for each disease of interest.
For the LungAI API, we run it only for the highest-confidence predicted class
to keep inference latency low.

INTEGRATION WITH BACKEND
-------------------------
This file is STANDALONE in Phase 5 and does NOT touch the FastAPI backend yet.
Integration point (Phase 6+):
    from gradcam import GradCAM
    cam = GradCAM(model, target_layer)
    heatmap = cam.generate(image_tensor, class_idx)
    # overlay onto uploaded image, save to uploads/, return heatmapUrl in API response
"""

from typing import Optional
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


class GradCAM:
    """
    Grad-CAM for multi-label chest X-ray classification.

    Parameters
    ----------
    model : nn.Module
        Trained classification model.
    target_layer : nn.Module
        The convolutional layer to hook for activation/gradient capture.
        Use model_utils.get_gradcam_target_layer() to retrieve this.
    device : torch.device
        CPU or CUDA device the model lives on.
    """

    def __init__(self, model: nn.Module, target_layer: nn.Module, device: torch.device):
        self.model = model
        self.target_layer = target_layer
        self.device = device
        self.model.eval()

        self._gradients: Optional[torch.Tensor] = None
        self._activations: Optional[torch.Tensor] = None

        # Register forward hook to capture spatial feature maps
        self._fwd_hook = target_layer.register_forward_hook(self._save_activations)
        # Register full backward hook to capture gradients
        self._bwd_hook = target_layer.register_full_backward_hook(self._save_gradients)

    def _save_activations(self, module, input, output):
        self._activations = output.detach()

    def _save_gradients(self, module, grad_input, grad_output):
        # grad_output[0] has shape (B, C, H, W)
        self._gradients = grad_output[0].detach()

    def remove_hooks(self):
        """Call this when done with the GradCAM instance to free memory."""
        self._fwd_hook.remove()
        self._bwd_hook.remove()

    def generate(
        self,
        image_tensor: torch.Tensor,
        class_idx: int,
        smooth_factor: int = 0,
    ) -> np.ndarray:
        """
        Generates a Grad-CAM heatmap for the specified class.

        Parameters
        ----------
        image_tensor : torch.Tensor
            Shape (1, 3, H, W), normalized with ImageNet mean/std.
            Must be on the same device as the model.
        class_idx : int
            Disease class index (0–13 for NIH ChestX-ray14).
            Use dataset.CLASS_TO_IDX["Pneumonia"] etc.
        smooth_factor : int
            SmoothGrad passes (0 = standard Grad-CAM; ≥ 10 = smoother but slower).

        Returns
        -------
        np.ndarray
            Normalized Grad-CAM heatmap, float32 in [0, 1], shape (H_in, W_in).
            Ready to be passed to overlay_heatmap_on_xray() for visualization.
        """
        if smooth_factor > 1:
            return self._smoothgrad_cam(image_tensor, class_idx, smooth_factor)
        return self._single_cam(image_tensor, class_idx)

    def _single_cam(self, image_tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        image_tensor = image_tensor.to(self.device).requires_grad_(True)
        self.model.zero_grad()

        logits = self.model(image_tensor)           # (1, 14)
        # Backpropagate on the target class only
        score = logits[0, class_idx]
        score.backward()

        return self._build_heatmap(image_tensor)

    def _smoothgrad_cam(
        self, image_tensor: torch.Tensor, class_idx: int, n_samples: int
    ) -> np.ndarray:
        """
        SmoothGrad-CAM: averages Grad-CAM over n_samples noisy copies of the input.
        Reference: https://arxiv.org/abs/1706.03825
        """
        noise_std = 0.15 * (image_tensor.max() - image_tensor.min()).item()
        heatmaps = []
        for _ in range(n_samples):
            noisy = image_tensor + torch.randn_like(image_tensor) * noise_std
            noisy = noisy.to(self.device).requires_grad_(True)
            self.model.zero_grad()
            logits = self.model(noisy)
            logits[0, class_idx].backward()
            heatmaps.append(self._build_heatmap(noisy))
        return np.mean(heatmaps, axis=0)

    def _build_heatmap(self, image_tensor: torch.Tensor) -> np.ndarray:
        # Global Average Pool gradients → α^k_c weights (C,)
        alpha = self._gradients.mean(dim=(2, 3), keepdim=True)   # (1, C, 1, 1)
        # Weighted combination of activation maps
        cam = (alpha * self._activations).sum(dim=1, keepdim=True)  # (1, 1, h, w)
        cam = F.relu(cam)

        # Upsample to input resolution
        h_in = image_tensor.shape[2]
        w_in = image_tensor.shape[3]
        cam = F.interpolate(cam, size=(h_in, w_in), mode="bilinear", align_corners=False)
        cam = cam.squeeze().cpu().numpy()    # (H_in, W_in)

        # Min-max normalize to [0, 1]
        if cam.max() > cam.min():
            cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        else:
            cam = np.zeros_like(cam)

        return cam.astype(np.float32)

    def generate_for_top_class(self, image_tensor: torch.Tensor) -> tuple:
        """
        Runs inference and Grad-CAM for the highest-confidence predicted class.
        Convenience wrapper used by the backend inference pipeline.

        Returns
        -------
        heatmap : np.ndarray  — shape (H, W), float32 [0, 1]
        class_idx : int       — class index of highest confidence
        probs : np.ndarray    — shape (14,), sigmoid probabilities for all classes
        """
        with torch.no_grad():
            logits = self.model(image_tensor.to(self.device))
            probs = torch.sigmoid(logits).squeeze().cpu().numpy()  # (14,)
        top_idx = int(np.argmax(probs))
        heatmap = self.generate(image_tensor, class_idx=top_idx)
        return heatmap, top_idx, probs


# ------------------------------------------------------------------
#  Heatmap Overlay Utility
# ------------------------------------------------------------------
def overlay_heatmap_on_xray(
    xray_rgb: np.ndarray,
    heatmap: np.ndarray,
    alpha: float = 0.45,
    colormap: str = "jet",
) -> np.ndarray:
    """
    Blends a Grad-CAM heatmap over the original X-ray image.

    Parameters
    ----------
    xray_rgb : np.ndarray
        Original X-ray image, uint8, shape (H, W, 3).
    heatmap : np.ndarray
        Grad-CAM heatmap, float32 [0, 1], shape (H, W).
    alpha : float
        Heatmap opacity (0 = only X-ray, 1 = only heatmap).
    colormap : str
        Matplotlib colormap name for the heatmap ('jet', 'inferno', 'magma').

    Returns
    -------
    np.ndarray
        Blended overlay, uint8, shape (H, W, 3).
    """
    import cv2  # optional dependency: pip install opencv-python

    heatmap_uint8 = np.uint8(255 * heatmap)
    cmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    cmap = cv2.cvtColor(cmap, cv2.COLOR_BGR2RGB)
    overlay = (alpha * cmap + (1 - alpha) * xray_rgb.astype(np.float32)).astype(np.uint8)
    return overlay


def save_gradcam_png(
    heatmap: np.ndarray,
    output_path: str,
    original_image: Optional[np.ndarray] = None,
) -> None:
    """
    Saves a Grad-CAM heatmap (and optional side-by-side original) as a PNG file.
    Output path is relative to backend/app/uploads/ for API serving.
    """
    from PIL import Image

    heatmap_uint8 = np.uint8(255 * heatmap)
    img = Image.fromarray(heatmap_uint8, mode="L")

    if original_image is not None:
        orig = Image.fromarray(original_image)
        combined = Image.new("RGB", (orig.width * 2, orig.height))
        combined.paste(orig, (0, 0))
        combined.paste(img.convert("RGB"), (orig.width, 0))
        combined.save(output_path)
    else:
        img.save(output_path)
