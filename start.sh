#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"

"$ROOT_DIR/scripts/dev-stop.sh" >/dev/null 2>&1 || true
mkdir -p "$RUNTIME_DIR"
rm -rf "$ROOT_DIR/.next"
find "$ROOT_DIR" -maxdepth 1 -type d -name '.next_stale_*' -prune -exec rm -rf {} +

cd "$ROOT_DIR"
exec npm run dev
