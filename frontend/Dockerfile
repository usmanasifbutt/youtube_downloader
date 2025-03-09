# Build the frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Serve using nginx
FROM nginx:alpine
COPY --from=frontend /app/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
