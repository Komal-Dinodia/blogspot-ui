# Step 1: Build the app
# Use the official Node.js image as the base image
FROM node:22.14.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app
# Use a lightweight web server to serve the app (such as serve)
FROM nginx:alpine

# Copy the build folder from the previous step to the NGINX container
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 5003
EXPOSE 5003

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
