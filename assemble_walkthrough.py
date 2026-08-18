from pathlib import Path
import subprocess

ROOT = Path('/home/ubuntu/promptforge')
FRAMES = ROOT / 'walkthrough_frames'
SEGMENTS = ROOT / 'walkthrough_segments'
SEGMENTS.mkdir(exist_ok=True)

scenes = [
    ('intro.png', 6),
    ('choose.png', 8),
    ('builder.png', 10),
    ('details.png', 10),
    ('preview.png', 10),
    ('library_card.png', 7),
    ('library.png', 10),
    ('account.png', 8),
    ('unlock.png', 8),
    ('outro.png', 7),
]

for index, (filename, duration) in enumerate(scenes, 1):
    source = FRAMES / filename
    output = SEGMENTS / f'{index:02d}.mp4'
    fade_out_start = max(0, duration - 0.35)
    vf = (
        f"scale=1280:720:force_original_aspect_ratio=increase,"
        f"crop=1280:720,format=yuv420p,"
        f"fade=t=in:st=0:d=0.35,fade=t=out:st={fade_out_start}:d=0.35"
    )
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', str(source),
        '-t', str(duration), '-vf', vf, '-r', '25', '-an', '-pix_fmt', 'yuv420p', str(output)
    ], check=True)

concat_file = ROOT / 'walkthrough_concat.txt'
concat_file.write_text('\n'.join(f"file '{(SEGMENTS / f'{i:02d}.mp4').as_posix()}'" for i in range(1, len(scenes) + 1)) + '\n')
video_only = ROOT / 'walkthrough_video_only.mp4'
subprocess.run([
    'ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
    '-c', 'copy', str(video_only)
], check=True)

final = ROOT / 'promptforge_new_user_walkthrough.mp4'
subprocess.run([
    'ffmpeg', '-y', '-loglevel', 'error', '-i', str(video_only), '-i', str(ROOT / 'walkthrough_narration_final.wav'),
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
    '-shortest', '-movflags', '+faststart', str(final)
], check=True)
print(final)
