from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

root = Path('/home/ubuntu/promptforge')
frames = []
for name in ['walkthrough_review_00.png', 'walkthrough_review_20.png', 'walkthrough_review_40.png', 'walkthrough_review_60.png', 'walkthrough_review_73.png']:
    image = Image.open(root / name).convert('RGB').resize((480, 270))
    image = ImageOps.expand(image, border=2, fill='#f97316')
    frames.append(image)
canvas = Image.new('RGB', (960, 810), '#0b0b0a')
for i, image in enumerate(frames):
    x = (i % 2) * 480
    y = (i // 2) * 270
    canvas.paste(image, (x, y))
canvas.save(root / 'walkthrough_review_contact_sheet.png')
