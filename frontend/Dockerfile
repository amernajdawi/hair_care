# Use an official Node runtime as the base image for the frontend
FROM node:18-alpine

# Set the working directory for the frontend
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the frontend source code
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Set the environment variable for the API URL
ENV REACT_APP_API_URL=http://backend:8000

# Build the frontend
RUN npm run build

# Expose the port the frontend will run on (adjust if necessary)
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]