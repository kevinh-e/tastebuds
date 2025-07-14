FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# build step is done in google cloud build
# RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
# Copy production dependencies and built application from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

EXPOSE 8080
CMD ["npm", "run", "start"]
