# Multi-stage build: Vite build, then serve static files via nginx.
# Traefik handles TLS/routing externally - this container only serves
# plain HTTP on port 80, matching the backend services' pattern.

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# npm install, not npm ci: the committed lockfile is missing an optional
# platform dep entry (npm ci requires an exact match, npm install resolves
# it) - not touching the lockfile itself since regenerating it bumps
# hundreds of unrelated versions, far too broad a change for this fix.
RUN npm install

COPY . .

# Vite bakes VITE_* vars into the bundle at build time, so they must be
# present as real env vars before `vite build` runs - build args are the
# way to pass per-environment backend URLs into a Docker build.
ARG VITE_BACKEND_URL_AUTH=""
ARG VITE_BACKEND_URL_COMPANY=""
ARG VITE_BACKEND_URL_PROFESSIONAL=""
ARG VITE_BACKEND_URL_EVENTS=""
ARG VITE_BACKEND_URL_MEDIA=""
ARG VITE_BACKEND_URL_LEADS=""
ARG VITE_BACKEND_URL_PAYMENT=""
ARG VITE_BACKEND_URL_ADMIN=""
ARG VITE_BACKEND_URL_JOB_APPLICATIONS=""

ENV VITE_BACKEND_URL_AUTH=$VITE_BACKEND_URL_AUTH \
    VITE_BACKEND_URL_COMPANY=$VITE_BACKEND_URL_COMPANY \
    VITE_BACKEND_URL_PROFESSIONAL=$VITE_BACKEND_URL_PROFESSIONAL \
    VITE_BACKEND_URL_EVENTS=$VITE_BACKEND_URL_EVENTS \
    VITE_BACKEND_URL_MEDIA=$VITE_BACKEND_URL_MEDIA \
    VITE_BACKEND_URL_LEADS=$VITE_BACKEND_URL_LEADS \
    VITE_BACKEND_URL_PAYMENT=$VITE_BACKEND_URL_PAYMENT \
    VITE_BACKEND_URL_ADMIN=$VITE_BACKEND_URL_ADMIN \
    VITE_BACKEND_URL_JOB_APPLICATIONS=$VITE_BACKEND_URL_JOB_APPLICATIONS

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
