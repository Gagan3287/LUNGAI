# LungAI

**A 3D Interactive Explainability System for Deep Learning-Based Multi-Disease Chest X-Ray Detection**

LungAI is a full-stack clinical workstation prototype that classifies chest X-rays across 14 thoracic disease categories using a trained DenseNet-121 model, and — distinctively — projects the model's Grad-CAM explainability output onto an interactive 3D anatomical lung model, rather than a flat 2D heatmap.

> **Research/portfolio prototype.** Not intended for real clinical diagnostic use.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Model Performance](#model-performance)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Training the Model Yourself](#training-the-model-yourself)
- [Limitations](#limitations)
- [Future Work](#future-work)
- [License](#license)

---

## Overview

Standard chest X-ray explainability tools (Grad-CAM) render a static 2D heatmap over the flat radiograph — offering no spatial or anatomical context, and no way to explore the finding beyond a single fixed overlay. Meanwhile, interactive 3D visualization tools in radiology (3D Slicer, SenseCare) require genuine volumetric CT/MRI data, which a standard 2D chest X-ray doesn't have.

LungAI bridges this gap: it takes a 2D CNN's prediction and Grad-CAM region, and maps it onto a **schematic, interactive 3D lung model** that a clinician can rotate, zoom, and explore — while remaining honest that this is an anatomical reference, not a patient-specific reconstruction.

## Key Features

- 🫁 **Interactive 3D lung visualization** — rotatable, zoomable holographic lung model with a pulsing abnormality marker at the AI's predicted region
- 🧠 **Real trained deep learning model** — DenseNet-121 fine-tuned on the full NIH ChestX-ray14 dataset (112,120 images), not a mock/placeholder
- 🔬 **Grad-CAM explainability** — 2D activation mapping projected onto a 3D anatomical zone
- 📊 **Full clinical workstation** — scan upload, AI analysis summary, confidence breakdown, scan history, patient records
- 🔐 **Authentication** — doctor login (bcrypt-hashed credentials) with guest access
- 🐳 **Fully containerized** — Docker Compose for reproducible deployment
- 📄 **Backed by a research paper** — real evaluation methodology, bootstrap confidence intervals, and comparison against published literature

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion |
| 3D Visualization | React Three Fiber (Three.js) |
| Backend | FastAPI, SQLAlchemy, SQLite |
| Deep Learning | PyTorch, DenseNet-121, Grad-CAM |
| Auth | bcrypt password hashing, session tokens |
| Deployment | Docker, Docker Compose |
| Dataset | [NIH ChestX-ray14](https://www.kaggle.com/datasets/nih-chest-xrays/data) (112,120 images, 14 disease classes) |

## Model Performance

The classifier was trained on the complete NIH ChestX-ray14 corpus using a **patient-wise data split** (70/10/20 train/val/test, zero patient overlap across partitions — verified programmatically) to prevent data leakage.

**Final Test Mean AUROC: 0.8318** (macro-averaged across 14 classes)
**Final Test Mean AUPRC: 0.2468**

| Disease Class | AUROC | AUPRC |
|---|---|---|
| Hernia | 0.9442 | 0.2694 |
| Emphysema | 0.9290 | 0.3795 |
| Cardiomegaly | 0.9121 | 0.3239 |
| Edema | 0.8913 | 0.1603 |
| Pneumothorax | 0.8747 | 0.3071 |
| Effusion | 0.8738 | 0.4850 |
| Mass | 0.8351 | 0.2769 |
| Consolidation | 0.8028 | 0.1490 |
| Pleural Thickening | 0.7983 | 0.1361 |
| Atelectasis | 0.7925 | 0.3067 |
| Fibrosis | 0.7916 | 0.0723 |
| Nodule | 0.7508 | 0.2021 |
| Pneumonia | 0.7411 | 0.0353 |
| Infiltration | 0.7072 | 0.3518 |

Full per-class results with bootstrap 95% confidence intervals, training curves, and comparison against published baselines (Wang et al., CheXNet) are available in [`ml_pipeline/results/`](ml_pipeline/results/) and in the accompanying research paper.

## Project Structure

```
LungAI/
├── frontend/               # Next.js app (landing page, workstation dashboard, 3D viz)
├── backend/                # FastAPI backend
│   └── app/ml/             # Self-contained real inference module (model, Grad-CAM, checkpoint)
├── ml_pipeline/            # Training/evaluation pipeline (dataset, model, train, evaluate)
│   ├── checkpoints/        # Trained model weights
│   └── results/            # Real evaluation outputs, figures, and data splits
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker Desktop (optional, for containerized run)

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Runs on `http://localhost:8000` (API docs at `/docs`).

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:8080`.

## Running with Docker

```bash
docker compose up --build
```
This builds and starts both the frontend (`:8080`) and backend (`:8000`) containers, with the trained model and database persisted via volume mounts.

## Training the Model Yourself

The full training pipeline is in [`ml_pipeline/`](ml_pipeline/). Given the dataset size (~45GB, 112,120 images), training was performed on Kaggle's free GPU tier (NVIDIA T4×2):

1. Load the [NIH ChestX-ray14 dataset](https://www.kaggle.com/datasets/nih-chest-xrays/data) on Kaggle
2. Run the pipeline cells from `ml_pipeline/` (patient-wise split → DenseNet-121 training with AMP + early stopping → evaluation)
3. Download the resulting `best_model.pth` and place it in `ml_pipeline/checkpoints/` and `backend/app/ml/checkpoints/`

See `ml_pipeline/train.py` and `ml_pipeline/evaluate.py` for the full implementation.

## Limitations

- The 3D lung model is a **schematic anatomical reference**, not a patient-specific volumetric reconstruction — a single 2D X-ray does not contain true 3D geometry.
- Results reflect a **single training run** with a fixed random seed, consistent with the evaluation protocol of the baseline papers compared against, rather than multi-seed or k-fold statistical validation.
- No formal clinician usability study has yet been conducted comparing the 3D interface against conventional 2D Grad-CAM heatmaps.
- This is a research/portfolio prototype and is **not validated for clinical use**.

## Future Work

- Multi-seed statistical validation of the reported result
- Structured usability study: 3D explainability vs. flat 2D heatmap
- Independent reproduction of baseline methods for a controlled comparison
- Refinement of the 2D-to-3D zone mapping via automated lung-field segmentation
- Anatomically accurate 3D lung geometry (current version is a stylized placeholder)

## License

This project is for academic/research purposes. See individual dependencies for their respective licenses.

---

*Built as a research prototype exploring explainable AI interfaces for medical imaging. Not for clinical use.*
