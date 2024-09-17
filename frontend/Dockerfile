# Use a multi-stage build for smaller final image
FROM node:18-alpine AS build

# Set the working directory for the frontend
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
RUN npm ci

# Copy the frontend source code
COPY . .
RUN npm run build

# Use nginx to serve the built static files
FROM nginx:alpine

# Copy the built static files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the frontend will run on (adjust if necessary)
EXPOSE 8080

# Start the frontend application using nginx
CMD ["nginx", "-g", "daemon off;"]