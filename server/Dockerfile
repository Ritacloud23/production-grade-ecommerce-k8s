# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# App runs on 5000 inside container
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]