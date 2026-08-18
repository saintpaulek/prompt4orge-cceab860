from PIL import Image

source = Image.open('/home/ubuntu/screenshots/webdev-preview-root-1787052085721009584-6994.png').convert('RGB')
width, height = source.size
target_height = round(width * 9 / 16)
if target_height > height:
    target_width = round(height * 16 / 9)
    left = (width - target_width) // 2
    box = (left, 0, left + target_width, height)
else:
    top = max(0, (height - target_height) // 2)
    box = (0, top, width, top + target_height)
source.crop(box).save('/home/ubuntu/promptforge/builder_reference_16x9.png')
