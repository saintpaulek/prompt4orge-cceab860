from pathlib import Path
import subprocess

ROOT = Path('/home/ubuntu/promptforge')
FRAMES = ROOT / 'portrait_frames'
SCROLLS = ROOT / 'social_scroll_segments'
SCROLLS.mkdir(exist_ok=True)

# Full-page mobile captures from the verified app.
scenes = [
    ('intro.png', 6, False),
    ('webdev-preview-root-1787058222561023394-6764.png', 12, True),
    ('webdev-preview-library-1787058221649931926-2431.png', 12, True),
    ('webdev-preview-about-1787058222705203369-9010.png', 10, True),
    ('webdev-preview-contact-1787058221745217785-9201.png', 10, True),
    ('account.png', 8, False),
    ('unlock.png', 8, False),
    ('outro.png', 6, False),
]

for index, (filename, duration, scrolling) in enumerate(scenes, 1):
    if scrolling:
        source = {
            'webdev-preview-root-1787058222561023394-6764.png': '/home/ubuntu/screenshots/webdev-preview-root-1787058222561023394-6764.png',
            'webdev-preview-library-1787058221649931926-2431.png': '/home/ubuntu/screenshots/webdev-preview-library-1787058221649931926-2431.png',
            'webdev-preview-about-1787058222705203369-9010.png': '/home/ubuntu/screenshots/webdev-preview-about-1787058222705203369-9010.png',
            'webdev-preview-contact-1787058221745217785-9201.png': '/home/ubuntu/screenshots/webdev-preview-contact-1787058221745217785-9201.png',
        }[filename]
    else:
        source = str(FRAMES / filename)
    output = SCROLLS / f'{index:02d}.mp4'
    fade_out = max(0, duration - 0.35)
    if scrolling:
        y_expr = f"(in_h-out_h)*t/{duration}"
        vf = f"scale=720:-2,crop=720:1280:0:'{y_expr}',format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st={fade_out}:d=0.35"
    else:
        vf = f"scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st={fade_out}:d=0.35"
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', source,
        '-t', str(duration), '-vf', vf, '-r', '25', '-an', '-pix_fmt', 'yuv420p', str(output)
    ], check=True)

concat = ROOT / 'social_portrait_concat.txt'
concat.write_text('\n'.join(f"file '{(SCROLLS / f'{i:02d}.mp4').as_posix()}'" for i in range(1, len(scenes) + 1)) + '\n')
video_only = ROOT / 'social_portrait_video_only.mp4'
subprocess.run([
    'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(concat),
    '-c', 'copy', str(video_only)
], check=True)

# Mix voiceover above music, then burn in timed dynamic captions.
final = ROOT / 'promptforge_social_walkthrough_9x16.mp4'
subprocess.run([
    'ffmpeg', '-y', '-loglevel', 'error', '-i', str(video_only),
    '-i', str(ROOT / 'social_walkthrough_narration.wav'),
    '-i', str(ROOT / 'promptforge_walkthrough_music.wav'),
    '-filter_complex', '[1:a]volume=1.0[narr];[2:a]volume=0.14[music];[narr][music]amix=inputs=2:duration=shortest:dropout_transition=2[a]',
    '-map', '0:v:0', '-map', '[a]', '-vf', f"subtitles={ROOT / 'social_captions.ass'}",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '160k',
    '-shortest', '-movflags', '+faststart', str(final)
], check=True)
print(final)
