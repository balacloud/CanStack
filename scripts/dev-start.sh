#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"
PID_FILE="$RUNTIME_DIR/canstack-dev.pid"
LOG_FILE="$RUNTIME_DIR/canstack-dev.log"

mkdir -p "$RUNTIME_DIR"

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

stop_existing() {
  if [[ -f "$PID_FILE" ]]; then
    local existing_pid
    existing_pid="$(cat "$PID_FILE")"
    if [[ -n "$existing_pid" ]]; then
      kill_pid "$existing_pid"
    fi
    rm -f "$PID_FILE"
  fi

  local port_pids
  port_pids="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$port_pids" ]]; then
    for pid in ${(f)port_pids}; do
      kill_pid "$pid"
    done
  fi
}

clean_build_artifacts() {
  rm -rf "$ROOT_DIR/.next"
  find "$ROOT_DIR" -maxdepth 1 -type d -name '.next_stale_*' -prune -exec rm -rf {} +
}

stop_existing
clean_build_artifacts

cd "$ROOT_DIR"
nohup zsh -lc "cd '$ROOT_DIR' && exec npm run dev" >"$LOG_FILE" 2>&1 < /dev/null &
LAUNCHER_PID=$!

for _ in {1..30}; do
  LISTEN_PID="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1)"
  if [[ -n "$LISTEN_PID" ]]; then
    echo "$LISTEN_PID" >"$PID_FILE"
    echo "CanStack dev server started on http://localhost:$PORT"
    echo "PID: $LISTEN_PID"
    echo "Log: $LOG_FILE"
    exit 0
  fi
  sleep 1
done

if kill -0 "$LAUNCHER_PID" 2>/dev/null; then
  kill_pid "$LAUNCHER_PID"
fi

echo "Failed to start CanStack dev server on port $PORT" >&2
echo "Recent log output:" >&2
tail -n 40 "$LOG_FILE" >&2 || true
exit 1
