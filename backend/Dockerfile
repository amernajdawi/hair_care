# Use an official Python runtime as the base image for the backend
FROM python:3.10.14-slim-bullseye

# Set the working directory for the backend
WORKDIR /app

# Install Poetry and dependencies
RUN pip install --no-cache-dir poetry==1.4.2 \
    && apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install ffmpeg and related libraries
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y

# Copy pyproject.toml and poetry.lock (if available)
COPY pyproject.toml poetry.lock* ./

# Project initialization:
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the backend source code
COPY . .

# Install Tesseract OCR and Python packages
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

RUN pip install pytesseract pillow opencv-python-headless

# Expose the port the app runs on
EXPOSE 8080

# Start the backend server
CMD ["python", "api.py"]