#!/bin/bash
# Prepares a Claude Code on the web container to preview and render HyperFrames videos.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

HF_VERSION="0.8.80"

# FFmpeg / FFprobe: required by the HyperFrames renderer.
if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get install -y -qq ffmpeg >/dev/null 2>&1 || {
    apt-get update -qq >/dev/null 2>&1
    apt-get install -y -qq ffmpeg >/dev/null 2>&1
  }
fi

# Warm the npx cache for the pinned CLI and download the headless Chrome it renders with.
HYPERFRAMES_SKIP_SKILLS=1 npx --yes "hyperframes@${HF_VERSION}" browser ensure >/dev/null 2>&1

echo "HyperFrames ${HF_VERSION} ready: $(ffmpeg -version | head -n1)"
