# --- Stage 1: Build ---
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 1. Catch the variable from Jenkins
ARG VITE_API_URL
# 2. Expose it so Vite can see it during 'npm run build'
ENV VITE_API_URL=$VITE_API_URL

# 3. Build the app (Vite bakes the variable in NOW)
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]