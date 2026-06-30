#!/bin/zsh
set -e

PROJECT_DIR="${0:A:h}"
NODE="$(command -v node || true)"
PORT="4173"
URL="http://127.0.0.1:$PORT"

cd "$PROJECT_DIR"

if /usr/sbin/lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Lotwise is already running. Opening the demo…"
  [[ "${LOTWISE_NO_OPEN:-0}" == "1" ]] || open "$URL"
  exit 0
fi

if [[ -z "$NODE" || ! -x "$NODE" ]]; then
  echo "Lotwise needs Node.js 20 or newer."
  echo "Install Node.js, run pnpm install, then try this launcher again."
  read -k 1 "?Press any key to close."
  exit 1
fi

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

echo "Starting Lotwise: Janiak Warehouse Inventory…"
echo "Keep this Terminal window open during the demo."
echo "Mac: $URL"
if [[ -n "$LAN_IP" ]]; then
  echo "Phone on the same Wi-Fi: http://$LAN_IP:$PORT"
else
  echo "Phone access: connect both devices to the same Wi-Fi, then use this Mac's local IP with port $PORT."
fi
echo ""

"$NODE" node_modules/vite/bin/vite.js --host 0.0.0.0 --port "$PORT" &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM

for attempt in {1..20}; do
  if curl -s "$URL" >/dev/null 2>&1; then
    [[ "${LOTWISE_NO_OPEN:-0}" == "1" ]] || open "$URL"
    break
  fi
  sleep 0.25
done

wait "$SERVER_PID"
