from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

root = Path('/home/ubuntu/promptforge')
times = ['00', '10', '25', '35', '45', '55']
thumbs = []
for time in times:
    image = Image.open(root / f'social_review_{time}.png').convert('RGB').resize((240, 426))
    image = ImageOps.expand(image, border=2, fill='#f97316')
    thumbs.append(image)
canvas = Image.new('RGB', (720, 852), '#0b0b0a')
for i, image in enumerate(thumbs):
    canvas.paste(image, ((i % 3) * 240, (i // 3) * 426))
canvas.save(root / 'social_portrait_review_sheet.png')
