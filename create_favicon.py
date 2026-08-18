from PIL import Image
from pathlib import Path

source = Image.open('/home/ubuntu/upload/promptforgelogo.png').convert('RGBA')
# The emblem occupies the left side of the original wordmark; crop around it and keep a small black breathing room.
emblem = source.crop((330, 615, 630, 900))
canvas = Image.new('RGBA', (360, 360), (8, 8, 7, 255))
emblem.thumbnail((290, 290), Image.Resampling.LANCZOS)
canvas.alpha_composite(emblem, ((360 - emblem.width) // 2, (360 - emblem.height) // 2))
public = Path('/home/ubuntu/promptforge/client/public')
public.mkdir(parents=True, exist_ok=True)
canvas.resize((64, 64), Image.Resampling.LANCZOS).save(public / 'favicon.png', optimize=True)
canvas.resize((180, 180), Image.Resampling.LANCZOS).save(public / 'apple-touch-icon.png', optimize=True)
canvas.resize((512, 512), Image.Resampling.LANCZOS).save(public / 'favicon-512.png', optimize=True)
canvas.resize((256, 256), Image.Resampling.LANCZOS).save(public / 'favicon.ico', format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
