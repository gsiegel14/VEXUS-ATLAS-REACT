## Multi-stage build for React + Node server (original code paths)

FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/server.js ./server.js
COPY --from=build /app/services ./services
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "server.js"]

