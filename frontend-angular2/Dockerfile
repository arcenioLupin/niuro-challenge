# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/frontend-angular2/browser ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4300
