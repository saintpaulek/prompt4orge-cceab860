from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from pathlib import Path

ROOT = Path('/home/ubuntu/promptforge')
source = Image.open('/home/ubuntu/screenshots/webdev-preview-root-1787058222561023394-6764.png').convert('RGB')
source = ImageEnhance.Brightness(source).enhance(0.55)
source = source.resize((1080, round(source.height * 1080 / source.width)))
source = source.crop((0, min(0, source.height - 1080), 1080, min(0, source.height - 1080) + 1080))
source = source.filter(ImageFilter.GaussianBlur(1.3))
canvas = source.copy()
overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)
# A dark veil keeps the captured mobile UI atmospheric but prevents ghosted text from competing with the poster headline.
draw.rectangle((0, 0, 1080, 1080), fill=(8, 8, 7, 125))
# Strong editorial bands for exact text legibility.
draw.rectangle((0, 0, 1080, 280), fill=(8, 8, 7, 190))
draw.rectangle((0, 650, 1080, 1080), fill=(8, 8, 7, 220))
draw.rectangle((0, 0, 1080, 12), fill=(249, 115, 22, 255))
canvas = Image.alpha_composite(canvas.convert('RGBA'), overlay)
draw = ImageDraw.Draw(canvas)
font_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font_regular = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
draw.text((70, 86), 'PROMPT WORKSHOP / 01', font=ImageFont.truetype(font_bold, 28), fill='#f97316')
draw.multiline_text((70, 350), 'Forge prompts\nthat ship.', font=ImageFont.truetype(font_bold, 86), fill='#f4efe8', spacing=6)
draw.text((70, 690), 'A practical AI prompt workshop\nfor ideas that need to move.', font=ImageFont.truetype(font_regular, 34), fill='#d0c9bf', spacing=12)
draw.text((70, 930), 'BUILDER  •  LIBRARY  •  WORKFLOW', font=ImageFont.truetype(font_bold, 22), fill='#f97316')
logo_path = Path('/home/ubuntu/upload/promptforgelogo.png')
if logo_path.exists():
    logo = Image.open(logo_path).convert('RGBA')
    logo.thumbnail((280, 95), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, (730, 76))
canvas.convert('RGB').save('/home/ubuntu/promptforge/promptforge_square_poster.png', quality=95)
