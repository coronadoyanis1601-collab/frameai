FROM node:18-alpine

WORKDIR /app

# Copy all files fresh
COPY . .

# Install root dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build client — no cache possible
WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && node server/seed.js && node server/index.js"]
