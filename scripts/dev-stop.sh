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

kill_pid() {
  local pid="$1"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    for _ in {1..10}; do
      if ! kill -0 "$pid" 2>/dev/null; then
        return
      fi
      sleep 0.5
    done
    kill -9 "$pid" 2>/dev/null || true
  fi
}

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE")"
  if [[ -n "$PID" ]]; then
    kill_pid "$PID"
  fi
  rm -f "$PID_FILE"
fi

PORT_PIDS="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "$PORT_PIDS" ]]; then
  for pid in ${(f)PORT_PIDS}; do
    kill_pid "$pid"
  done
fi

echo "CanStack dev server stopped on port $PORT"
