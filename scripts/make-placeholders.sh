#!/usr/bin/env bash
# Generates small synthetic clips so the layout can be built before the real
# media arrives. Usage: scripts/make-placeholders.sh [out_dir]
set -euo pipefail
OUT="${1:-site/public/media/_placeholder}"
mkdir -p "$OUT"

mk() { # name color0 color1 [letterbox]
  local name=$1 c0=$2 c1=$3 lb=${4:-}
  local vf="vignette=PI/4"
  if [ -n "$lb" ]; then
    vf="$vf,drawbox=x=0:y=0:w=iw:h=58:color=black:t=fill,drawbox=x=0:y=ih-58:w=iw:h=58:color=black:t=fill"
  fi
  ffmpeg -nostdin -y -loglevel error -f lavfi -i "gradients=s=854x480:c0=$c0:c1=$c1:speed=0.02:d=5:r=24" \
    -vf "$vf" -c:v libx264 -preset veryfast -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  cp "$OUT/$name.mp4" "$OUT/$name.sm.mp4"
  ffmpeg -nostdin -y -loglevel error -ss 1 -i "$OUT/$name.mp4" -frames:v 1 -q:v 4 "$OUT/$name.jpg"
}

# Baseline takes: cold and flat.
mk plain-1 0x2b3440 0x0f1216
mk plain-2 0x30363d 0x101418
mk plain-3 0x283038 0x0d1013
mk plain-4 0x343a42 0x121518
mk gpt-1 0x3a2f45 0x120f16
mk gpt-2 0x40344a 0x141018
mk gpt-3 0x352c40 0x100d14
mk gpt-4 0x3d3248 0x130f17
# Film references: warm and letterboxed.
mk ref-1 0x7a2e2a 0x1a0d0b lb
mk ref-2 0x6b5a2a 0x16120a lb
mk ref-3 0x2a5a5e 0x0b1516 lb
# Homagia results.
mk ours-1 0x8a5a2e 0x1c120a
mk ours-2 0x7a4a3a 0x1a0f0c

echo "placeholders written to $OUT"
