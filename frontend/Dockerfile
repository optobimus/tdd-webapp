FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src

RUN npm install
RUN npm run build

FROM nginx:1.20

COPY docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

COPY --from=builder /app/dist /usr/share/nginx/html
