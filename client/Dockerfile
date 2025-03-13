# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Ensure clean build
RUN rm -rf node_modules/.vite

# Hardcode the backend URL in the .env file
RUN echo "VITE_BACKEND_URL=http://34.47.155.127" > .env

# Run the Vite build process
RUN npm run build

# Expose the Vite preview port
EXPOSE 80

# Start Vite preview server
CMD ["npm", "run", "preview"]






