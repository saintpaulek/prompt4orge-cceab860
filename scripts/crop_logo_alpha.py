from PIL import Image
from pathlib import Path

source = Path('/home/ubuntu/webdev-static-assets/promptforge-logo-header.png')
target = Path('/home/ubuntu/webdev-static-assets/promptforge-logo-header-cropped.png')
image = Image.open(source).convert('RGBA')
alpha = image.getchannel('A')
bbox = alpha.getbbox()
if bbox is None:
    raise SystemExit('Logo has no visible alpha content')
left, top, right, bottom = bbox
pad_x = max(12, round((right - left) * 0.03))
pad_y = max(8, round((bottom - top) * 0.08))
left = max(0, left - pad_x)
top = max(0, top - pad_y)
right = min(image.width, right + pad_x)
bottom = min(image.height, bottom + pad_y)
image.crop((left, top, right, bottom)).save(target, format='PNG', optimize=True)
print(f'cropped={target} size={right-left}x{bottom-top} bbox={(left, top, right, bottom)}')
