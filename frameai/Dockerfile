FROM node:18-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Build client — force remove any stale .js hook files from cache
COPY client ./client/
# Remove any corrupted cached useAuth.js (stale Docker layer)
RUN rm -f /app/client/src/hooks/useAuth.js 2>/dev/null || true
RUN rm -rf /app/client/node_modules 2>/dev/null || true
WORKDIR /app/client
RUN npm install
RUN npm run build

# Copy server
WORKDIR /app
COPY server ./server/
COPY .env.example .env.example

# Expose port
EXPOSE 3001

# Start
CMD npx prisma db push && node server/seed.js && node server/index.js
