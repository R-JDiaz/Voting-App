FROM node:20-alpine

# Install build tools for native modules
RUN apk add --no-cache python3 make g++ bash mysql-client

WORKDIR /app

# Copy package.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies (bcrypt will be compiled for Linux)
RUN npm install

# Copy the rest of your code
COPY . .


EXPOSE 3000

# Use the setup script as entrypoint
CMD ["npm", "run", "dev"]