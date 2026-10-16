#!/usr/bin/env bash
# Downloads the legacy assets listed in scripts/legacy-assets.txt (one "dest|url" per line) into assets/legacy/.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0
while IFS='|' read -r dest url || [[ -n "${dest:-}" ]]; do
  [[ -z "${dest// }" || "$dest" == \#* ]] && continue
  mkdir -p "assets/legacy/$(dirname "$dest")"
  if curl -fsSL --retry 3 --max-time 180 "$url" -o "assets/legacy/$dest"; then echo "ok   $dest"; else echo "FAIL $url" >&2; fail=$((fail + 1)); fi
done < scripts/legacy-assets.txt
echo "Done — $fail failure(s)."
