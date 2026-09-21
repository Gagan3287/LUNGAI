FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing bytecode and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV USE_REAL_MODEL=true

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure uploads and checkpoints directories exist inside container
RUN mkdir -p /app/app/uploads /app/app/ml/checkpoints

EXPOSE 8000

CMD ["python", "main.py"]

