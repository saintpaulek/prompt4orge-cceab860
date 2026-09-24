#!/usr/bin/env bash
set -euo pipefail
ROOT=/home/ubuntu/promptforge
ASSET=$ROOT/video-assets
OUT=$ASSET/promptforge-manus-build-walkthrough.mp4
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
BOLD=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
mkdir -p "$ASSET/segments"

cat > "$ASSET/title.txt" <<'EOF'
PROMPTFORGE × MANUS AI
EOF
cat > "$ASSET/subtitle.txt" <<'EOF'
From one natural-language brief to a branded, connected production web app
EOF
cat > "$ASSET/c1.txt" <<'EOF'
01 / THE FIRST PROMPT
EOF
cat > "$ASSET/s1.txt" <<'EOF'
Start with the product intent: audience, workflow, visual direction, mobile requirements, and definition of done.
EOF
cat > "$ASSET/c2.txt" <<'EOF'
02 / SHAPE THE BUILDER
EOF
cat > "$ASSET/s2.txt" <<'EOF'
Manus turns the brief into a working Builder with categories, structured fields, live output, and a reusable prompt workflow.
EOF
cat > "$ASSET/c3.txt" <<'EOF'
03 / CONNECT DATA + ACCESS
EOF
cat > "$ASSET/s3.txt" <<'EOF'
The Library connects to a real catalog with search, filters, sorting, loading states, copy actions, and protected locked work orders.
EOF
cat > "$ASSET/c4.txt" <<'EOF'
04 / AUTHENTICATION
EOF
cat > "$ASSET/s4.txt" <<'EOF'
Supabase handles identity. Google OAuth, email, magic links, recovery, profiles, and server-side authorization complete the member flow.
EOF
cat > "$ASSET/c5.txt" <<'EOF'
05 / LINK THE PLATFORMS
EOF
cat > "$ASSET/s5.txt" <<'EOF'
Google Cloud supplies OAuth. Resend delivers branded email. GitHub stores the source. Vercel builds and serves the paid domain.
EOF
cat > "$ASSET/c6.txt" <<'EOF'
06 / DEPLOY + VERIFY
EOF
cat > "$ASSET/s6.txt" <<'EOF'
Push to the main branch, verify DNS and production aliases, test API routes, and smoke-test the real domain on mobile.
EOF
cat > "$ASSET/c7.txt" <<'EOF'
07 / SEO + ANALYTICS
EOF
cat > "$ASSET/s7.txt" <<'EOF'
Add canonical metadata, Open Graph, structured data, static Blog documents, Google Analytics events, and deferred measurement scripts.
EOF
cat > "$ASSET/c8.txt" <<'EOF'
08 / MEASURE + IMPROVE
EOF
cat > "$ASSET/s8.txt" <<'EOF'
Prioritize the mobile hero, split route bundles, stabilize loading space, run Lighthouse, and iterate from evidence.
EOF

make_segment() {
  local n="$1"; local image="$2"; local chapter="$3"; local subtitle="$4"; local duration="$5"
  ffmpeg -y -loglevel error -loop 1 -i "$image" -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" -t "$duration" \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#080807,drawbox=x=0:y=0:w=1280:h=92:color=black@0.82:t=fill,drawtext=fontfile=$BOLD:textfile=$chapter:x=48:y=27:fontcolor=#f7f3eb:fontsize=29:reload=1,drawbox=x=0:y=598:w=1280:h=122:color=black@0.84:t=fill,drawtext=fontfile=$FONT:textfile=$subtitle:x=48:y=628:fontcolor=#f7f3eb:fontsize=21:line_spacing=8:reload=1" \
    -r 30 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 96k -shortest "$ASSET/segments/$n.mp4"
}

make_segment 01 /home/ubuntu/screenshots/webdev-preview-root-1789705481408762902-8354.png "$ASSET/title.txt" "$ASSET/subtitle.txt" 8
make_segment 02 /home/ubuntu/screenshots/webdev-preview-root-1789705481408762902-8354.png "$ASSET/c1.txt" "$ASSET/s1.txt" 9
make_segment 03 /home/ubuntu/screenshots/webdev-preview-root-1789705481408762902-8354.png "$ASSET/c2.txt" "$ASSET/s2.txt" 10
make_segment 04 /home/ubuntu/screenshots/webdev-preview-library-1789705480802304116-8932.png "$ASSET/c3.txt" "$ASSET/s3.txt" 10
make_segment 05 /home/ubuntu/screenshots/webdev-preview-auth-1789705485310493624-5523.png "$ASSET/c4.txt" "$ASSET/s4.txt" 10
make_segment 06 /home/ubuntu/screenshots/webdev-preview-pricing-1789705485297881019-5876.png "$ASSET/c5.txt" "$ASSET/s5.txt" 10
make_segment 07 /home/ubuntu/screenshots/webdev-preview-contact-1789705480201607604-2348.png "$ASSET/c6.txt" "$ASSET/s6.txt" 10
make_segment 08 /home/ubuntu/screenshots/webdev-preview-blog-1789705480805074088-1444.png "$ASSET/c7.txt" "$ASSET/s7.txt" 10
make_segment 09 /home/ubuntu/screenshots/webdev-preview-about-1789705481087408759-5937.png "$ASSET/c8.txt" "$ASSET/s8.txt" 10

printf "file '%s'\n" "$ASSET"/segments/*.mp4 > "$ASSET/segments/concat.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$ASSET/segments/concat.txt" -c copy "$OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
