# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files separately (faster caching)
COPY package.json ./

# Install dependencies inside the container
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy only necessary files
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["node", "index.js"]
