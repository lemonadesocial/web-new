# syntax=docker/dockerfile-upstream:1.4.0-rc1
### manifest
FROM public.ecr.aws/docker/library/node:20-alpine AS manifest

COPY package.json yarn.lock /tmp/
RUN sed -e 's/"version": "[^"]\+",/"version": "0.0.0",/' -i /tmp/package.json

### builder
FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache git
COPY --from=manifest /tmp/package.json /tmp/yarn.lock ./
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc \
    yarn install --frozen-lockfile && \
    rm -rf /usr/local/share/.cache/yarn

### build
FROM builder AS build

COPY . .
ARG APP_ENV
ARG ASSET_PREFIX
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_RELEASE
RUN NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=8192" yarn build

### nginx
FROM public.ecr.aws/nginx/nginx:1.21-alpine AS nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/.next/static /var/www/_next/static
COPY --from=build /app/public /var/www

### upload
FROM public.ecr.aws/aws-cli/aws-cli:2.9.21 AS upload

COPY --from=nginx /var/www .
ARG ASSET_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_DEFAULT_REGION
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_SESSION_TOKEN
RUN aws s3 sync . s3://$ASSET_BUCKET_NAME --acl public-read --size-only

### app
FROM public.ecr.aws/docker/library/node:20-alpine AS app
WORKDIR /app

COPY --from=build /app/.next/standalone .

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE
ENV NEXT_TELEMETRY_DISABLED=1
ENV KEEP_ALIVE_TIMEOUT=304000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
