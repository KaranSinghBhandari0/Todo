# --- Stage 1: Build ---
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the static files (creates /dist folder)
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine
# Copy built files from Stage 1 to Nginx folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose default Nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]