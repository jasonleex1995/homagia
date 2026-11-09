#!/usr/bin/env bash
# Converts every clip under <raw_dir> into web-ready files, mirroring the folder
# layout into <out_dir> (default: site/public/media):
#   name.mp4     big players: original resolution up to 1080p, H.264, no audio
#   name.sm.mp4  grid tiles: 480p, smaller file
#   name.jpg     poster frame shown before the clip loads
#
# Usage:  scripts/encode.sh raw [site/public/media]
#         KEEP_AUDIO=1 CRF=20 scripts/encode.sh raw     # keep sound / higher quality
set -euo pipefail

RAW="${1:?usage: scripts/encode.sh <raw_dir> [out_dir]}"
OUT="${2:-site/public/media}"
CRF="${CRF:-22}"
RAW="${RAW%/}"

audio=(-an)
if [ "${KEEP_AUDIO:-0}" = 1 ]; then audio=(-c:a aac -b:a 128k); fi

find "$RAW" -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' -o -iname '*.mkv' \) -print0 |
  while IFS= read -r -d '' f; do
    rel="${f#"$RAW"/}"
    dst="$OUT/${rel%.*}"
    mkdir -p "$(dirname "$dst")"

    ffmpeg -nostdin -y -loglevel error -i "$f" \
      -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p \
      -movflags +faststart "${audio[@]}" "$dst.mp4"
    ffmpeg -nostdin -y -loglevel error -i "$f" \
      -vf "scale=-2:480" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -an "$dst.sm.mp4"
    ffmpeg -nostdin -y -loglevel error -ss 0.5 -i "$f" -frames:v 1 -vf "scale='min(1280,iw)':-2" -q:v 3 "$dst.jpg"

    printf '%7s  %7s  %s\n' "$(du -h "$dst.mp4" | cut -f1)" "$(du -h "$dst.sm.mp4" | cut -f1)" "${rel%.*}"
  done

echo "done → $OUT   (full / small / name)"
