#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"
PID_FILE="$RUNTIME_DIR/canstack-dev.pid"

resolve_port() {
  if [[ -n "${CANSTACK_PORT:-}" ]]; then
    echo "$CANSTACK_PORT"
    return
  fi

  if [[ -f "$ROOT_DIR/.env.local" ]]; then
    local app_url
    app_url="$(sed -n 's/^NEXT_PUBLIC_APP_URL=http:\/\/localhost:\([0-9][0-9]*\)$/\1/p' "$ROOT_DIR/.env.local" | head -n 1)"
    if [[ -n "$app_url" ]]; then
      echo "$app_url"
      return
    fi
  fi

  echo "3100"
}

PORT="$(resolve_port)"
PORT_PIDS="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [[ -f "$PID_FILE" ]]; then
  echo "PID file: $(cat "$PID_FILE")"
else
  echo "PID file: not present"
fi

if [[ -n "$PORT_PIDS" ]]; then
  echo "Listening on port $PORT:"
  ps -o pid,ppid,command -p ${(j:,:)${(f)PORT_PIDS}}
else
  echo "No process listening on port $PORT"
fi
