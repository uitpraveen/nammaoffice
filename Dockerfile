# Build and run locally first. This file does not deploy anything.
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN groupadd --system --gid 1001 studio && useradd --system --uid 1001 --gid studio studio
COPY --from=build --chown=studio:studio /app/.next/standalone ./
COPY --from=build --chown=studio:studio /app/.next/static ./.next/static
COPY --from=build --chown=studio:studio /app/public ./public
USER studio
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:24-bookworm-slim AS worker
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 studio && useradd --system --uid 1001 --gid studio studio
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=studio:studio scripts ./scripts
COPY --chown=studio:studio lib ./lib
COPY --chown=studio:studio db ./db
COPY --chown=studio:studio public/images/clients ./public/images/clients
COPY --chown=studio:studio tsconfig.json ./
USER studio
CMD ["node", "--import", "tsx", "scripts/studio/worker.ts"]

# PostgreSQL 18 supplies matching dump/restore clients. No client tools are
# installed in the public web container.
FROM postgres:18-bookworm AS backup
WORKDIR /app
ENV NODE_ENV=production
COPY --from=node:24-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=worker --chown=1001:1001 /app /app
USER 1001:1001
ENTRYPOINT ["node", "--import", "tsx"]
CMD ["scripts/studio/backup.ts"]
