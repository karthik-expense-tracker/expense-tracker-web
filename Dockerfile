# ---------- BUILD STAGE ----------
FROM node:alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
