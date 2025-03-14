group "default" {
  targets = ["nginx", "app"]
}

target "builder" {
  context = "."
  dockerfile = "Dockerfile"
  target = "builder"
  secret = ["id=npmrc,src=.npmrc"]
}

variable "APP_ENV" { }
variable "ASSET_PREFIX" { }
variable "SENTRY_AUTH_TOKEN" { }
variable "SENTRY_ORG" { }
variable "SENTRY_PROJECT" { }
variable "SENTRY_RELEASE" { }

target "build" {
  context = "."
  dockerfile = "Dockerfile"
  target = "build"
  contexts = {
    builder = "target:builder"
  }
  args = {
    APP_ENV = APP_ENV
    ASSET_PREFIX = ASSET_PREFIX
    SENTRY_AUTH_TOKEN = SENTRY_AUTH_TOKEN
    SENTRY_ORG = SENTRY_ORG
    SENTRY_PROJECT = SENTRY_PROJECT
    SENTRY_RELEASE = SENTRY_RELEASE
  }
}

target "nginx" {
  context = "."
  dockerfile = "Dockerfile"
  target = "nginx"
  contexts = {
    build = "target:build"
  }
}

variable "ASSET_BUCKET_NAME" { }
variable "AWS_ACCESS_KEY_ID" { }
variable "AWS_DEFAULT_REGION" { }
variable "AWS_SECRET_ACCESS_KEY" { }
variable "AWS_SESSION_TOKEN" { }

target "upload" {
  context = "."
  dockerfile = "Dockerfile"
  target = "upload"
  contexts = {
    nginx = "target:nginx"
  }
  args = {
    ASSET_BUCKET_NAME = ASSET_BUCKET_NAME
    AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID
    AWS_DEFAULT_REGION = AWS_DEFAULT_REGION
    AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY
    AWS_SESSION_TOKEN = AWS_SESSION_TOKEN
  }
}

target "app" {
  context = "."
  dockerfile = "Dockerfile"
  target = "app"
  contexts = {
    build = "target:build"
  }
}
