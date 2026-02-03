# Stage 1: Build React App
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
# Config biar NPM gak gampang timeout & pakai registry stabil
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
