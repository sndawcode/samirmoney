#!/usr/bin/env bash
# Downloads the client's Google Drive photo shoots into assets/drive/<shoot>/ (git-ignored).
# Needs gdown: `pipx install gdown` (or `uv tool install gdown`).
set -euo pipefail
cd "$(dirname "$0")/.."
command -v gdown >/dev/null || { echo "gdown not found — install it: pipx install gdown" >&2; exit 1; }

while IFS='|' read -r shoot url; do
  mkdir -p "assets/drive/$shoot"
  gdown --folder "$url" -O "assets/drive/$shoot" --remaining-ok </dev/null \
    || echo "WARN $shoot incomplete — download the folder as a .zip from Drive and unzip it into assets/drive/$shoot" >&2
done <<'LIST'
marchands-2025|https://drive.google.com/drive/folders/1SrbHgUyiAEQSKvA5mk3aQ6KhmjXKMCe2
raps-tpe-2026|https://drive.google.com/drive/folders/1YsUN3JOeoBwwZJQzPHvt5GnTo7nFjYo-
resto-2024|https://drive.google.com/drive/folders/1xmOrrp3eeQl3qiQPgE8oxTR9yDaG5u-d
LIST

find assets/drive -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.tif' -o -iname '*.tiff' \
  -o -iname '*.webp' -o -iname '*.heic' -o -iname '*.dng' -o -iname '*.cr2' -o -iname '*.cr3' -o -iname '*.nef' -o -iname '*.arw' \) \
  | sort > assets/drive/INVENTORY.txt
echo "Inventory: $(wc -l < assets/drive/INVENTORY.txt | tr -d ' ') files → assets/drive/INVENTORY.txt"
