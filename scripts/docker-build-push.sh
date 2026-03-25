#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${IMAGE:-}"
PLATFORM="${PLATFORM:-linux/amd64}"
PUSH="${PUSH:-1}"

if [[ -z "${IMAGE}" ]]; then
  echo "IMAGE is required, for example: IMAGE=ghcr.io/acme/integrate-shop:latest"
  exit 1
fi

BUILD_ARGS=(
  --platform "${PLATFORM}"
  --file "${ROOT_DIR}/Dockerfile"
  --tag "${IMAGE}"
)

if [[ "${PUSH}" == "1" ]]; then
  BUILD_ARGS+=(--push)
else
  BUILD_ARGS+=(--load)
fi

docker buildx build "${BUILD_ARGS[@]}" "${ROOT_DIR}"
