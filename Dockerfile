# Use Node.js version 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (to cache dependencies)
COPY package*.json ./

# Install dependencies globally and locally
RUN npm install -g nodemon
RUN npm install

# Copy the rest of your code
COPY . .

# Command to start the app with hot reload
CMD ["nodemon", "server.js"]