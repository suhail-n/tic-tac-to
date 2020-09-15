FROM node:12.18.3-alpine3.9 as base
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm ci && npm run build
WORKDIR /app/server
RUN npm ci

FROM node:12.18.3-alpine3.9
WORKDIR /app/client/build
COPY --from=base /app/client/build .
WORKDIR /app/server
COPY --from=base /app/server .
EXPOSE 4000
ENTRYPOINT [ "node", "index.js" ]