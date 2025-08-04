# Multi-stage build for VEXUS Atlas Application
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install ALL dependencies (including dev dependencies for building)
# Don't copy package-lock.json to avoid platform-specific dependency issues
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Build React app
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies for backend
COPY package.json ./
RUN npm install --only=production && npm cache clean --force

# Copy backend server (renamed file without space)
COPY server.js ./server.js

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist

# Copy Google credentials (will be overridden by Cloud Run service account)
COPY google-credentials-production.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port (Cloud Run expects port 8080)
EXPOSE 8080

# Set PORT environment variable for production
ENV PORT=8080

# Start the application
CMD ["node", "server.js"] 