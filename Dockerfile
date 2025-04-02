# Use official Node.js image as base
FROM node:22.14.0

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app to the containers
COPY . .

# Expose port for development server
EXPOSE 5003

# Start Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
