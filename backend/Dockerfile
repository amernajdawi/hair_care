# Use an official Python runtime as the base image for the backend
FROM python:3.10-slim-bullseye

# Set the working directory for the backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry==1.4.2

# Copy pyproject.toml and poetry.lock
COPY pyproject.toml poetry.lock* ./

# Install project dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

# Copy the backend source code
COPY . .

# Install additional Python packages
RUN pip install pytesseract pillow opencv-python-headless

# Expose the port the app runs on
EXPOSE 8080

# Start the backend server
CMD ["python", "api.py"]