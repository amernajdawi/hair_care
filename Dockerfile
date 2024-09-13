# Use an official Node runtime as the base image for the frontend
FROM node:18-alpine as frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json (if available)
COPY frontend/package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the frontend source code
COPY frontend/ .

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm config set loglevel verbose && \
    (npm install --verbose \
        @types/react@18.2.21 \
        axios@1.5.0 \
        @types/axios@0.14.0 \
        react@18.2.0 \
        react-dom@18.2.0 && \
    npm list) || \
    (echo "npm installation failed. Error log:" && \
     cat /root/.npm/_logs/*-debug.log && \
     exit 1)

# Ensure the src directory exists and create a basic index.js if it doesn't exist
RUN mkdir -p src && \
    if [ ! -f src/index.js ]; then \
    echo "import React from 'react';" > src/index.js && \
    echo "import ReactDOM from 'react-dom/client';" >> src/index.js && \
    echo "import App from './App';" >> src/index.js && \
    echo "" >> src/index.js && \
    echo "const root = ReactDOM.createRoot(document.getElementById('root'));" >> src/index.js && \
    echo "root.render(<React.StrictMode><App /></React.StrictMode>);" >> src/index.js; \
    fi

# Set NODE_OPTIONS environment variable to use legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the frontend
RUN npm run build

# Use an official Python runtime as the base image for the backend
FROM python:3.10.14-slim-bullseye

# Set the working directory for the backend
WORKDIR /app

# Install Poetry and dependencies
RUN pip install --no-cache-dir poetry==1.4.2 \
    && apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Add Node.js repository and install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add the new line to install ffmpeg and related libraries
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y

# Copy pyproject.toml and poetry.lock (if available)
COPY backend/pyproject.toml backend/poetry.lock* ./backend/

# Set the working directory to the backend folder
WORKDIR /app/backend

# Project initialization:
RUN poetry update

RUN poetry install

# Copy the backend source code
COPY backend/ .

# Copy the built frontend from the frontend stage
COPY --from=frontend /app/frontend/build /app/frontend/build

# Expose the port the app runs on
EXPOSE 8000

# Start the backend server
# CMD ["sh", "-c", "cd backend && poetry shell && poetry install && python api.py"]
