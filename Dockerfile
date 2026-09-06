# ---------- BUILD STAGE ----------
FROM node:alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY jest.config.js ./

RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/build /usr/share/nginx/html

ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
