from PIL import Image, ImageOps
from pathlib import Path

root = Path('/home/ubuntu/promptforge')
files = [root / f'portrait_review_{t}.png' for t in ['00', '20', '40', '60', '73']]
thumbs = []
for file in files:
    image = Image.open(file).convert('RGB').resize((288, 512))
    thumbs.append(ImageOps.expand(image, border=2, fill='#f97316'))
canvas = Image.new('RGB', (864, 1024), '#0b0b0a')
for i, image in enumerate(thumbs):
    canvas.paste(image, ((i % 3) * 288, (i // 3) * 512))
canvas.save(root / 'portrait_review_contact_sheet.png')
