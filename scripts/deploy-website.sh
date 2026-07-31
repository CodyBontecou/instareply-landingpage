#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUT=$(mktemp -d)
trap 'rm -rf "$OUT"' EXIT HUP INT TERM

cp "$ROOT/index.html" "$ROOT/script.js" "$ROOT/styles.css" \
  "$ROOT/_headers" "$ROOT/robots.txt" "$ROOT/sitemap.xml" \
  "$ROOT/apple-touch-icon.png" "$ROOT/favicon-16x16.png" \
  "$ROOT/favicon-192x192.png" "$ROOT/favicon-32x32.png" \
  "$ROOT/favicon.ico" "$OUT/"
cp -R "$ROOT/blog" "$ROOT/privacy" "$ROOT/terms" "$OUT/"

wrangler pages deploy "$OUT" --project-name instareply

if command -v indexnow >/dev/null 2>&1; then
  indexnow submit-sitemap instareply.isolated.tech --recent-days 7 --confirm
else
  printf '%s\n' 'warning: indexnow CLI not found; production deployed without URL notification' >&2
fi
