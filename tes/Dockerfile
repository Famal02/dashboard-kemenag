# Tahap 1: Build React App
FROM node:18-alpine as build

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy semua source code
COPY . .

# Build aplikasi
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Tahap 2: Serve dengan Nginx
FROM nginx:alpine

# Copy hasil build dari Tahap 1 ke folder Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy konfigurasi custom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
