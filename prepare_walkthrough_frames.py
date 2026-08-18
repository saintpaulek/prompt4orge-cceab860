from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path('/home/ubuntu/promptforge/walkthrough_frames')
OUT.mkdir(exist_ok=True)

font_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font_regular = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def font(path, size):
    return ImageFont.truetype(path, size)

def crop_16_9(source, output):
    image = Image.open(source).convert('RGB')
    width, height = image.size
    target_height = round(width * 9 / 16)
    if target_height > height:
        target_width = round(height * 16 / 9)
        left = (width - target_width) // 2
        box = (left, 0, left + target_width, height)
    else:
        top = max(0, (height - target_height) // 2)
        box = (0, top, width, top + target_height)
    image.crop(box).save(output)

def title_card(number, kicker, headline, body, output):
    canvas = Image.new('RGB', (1280, 720), '#0b0b0a')
    draw = ImageDraw.Draw(canvas)
    orange = '#f97316'
    warm = '#f4efe8'
    muted = '#aaa39a'
    draw.rectangle((0, 0, 1280, 14), fill=orange)
    draw.rectangle((74, 120, 84, 280), fill=orange)
    draw.text((120, 130), kicker.upper(), font=font(font_bold, 22), fill=orange)
    draw.text((120, 190), headline, font=font(font_bold, 58), fill=warm)
    draw.multiline_text((120, 290), body, font=font(font_regular, 28), fill=muted, spacing=12)
    draw.text((120, 590), number, font=font(font_bold, 20), fill=orange)
    canvas.save(output)

crop_16_9('/home/ubuntu/promptforge/builder_reference_16x9.png', OUT / 'builder.png')
crop_16_9('/home/ubuntu/screenshots/3000-irb5ryq31og9w1m_2026-08-18_11-18-28_8443.webp', OUT / 'library.png')

title_card('01', 'Welcome to PromptForge', 'Forge prompts that ship.', 'A practical prompt workshop for creators, marketers,\nfreelancers, developers, and curious beginners.', OUT / 'intro.png')
title_card('02', 'Step one', 'Choose what you are making.', 'Start with a category that matches your next task.\nNo prompt theory required.', OUT / 'choose.png')
title_card('03', 'Step two', 'Add a few useful details.', 'Tell PromptForge about the project, audience, platform,\ntone, and primary goal.', OUT / 'details.png')
title_card('04', 'Step three', 'Watch your prompt take shape.', 'The live work order turns your choices into a clear,\nready-to-use instruction.', OUT / 'preview.png')
title_card('05', 'Step four', 'Browse when you need a head start.', 'Search the 3,000-prompt Library and filter by category\nor access level.', OUT / 'library_card.png')
title_card('06', 'Make it yours', 'Create an account to keep your work.', 'Sign in to save prompts, revisit your best work, and pick up\nwhere you left off.', OUT / 'account.png')
title_card('07', 'When you are ready', 'Unlock the full workshop.', 'Choose lifetime access to open the locked work orders\nand continue exploring the PromptForge Library.', OUT / 'unlock.png')
title_card('08', 'You are ready', 'Start building in PromptForge.', 'Copy, refine, save, and keep making better instructions.', OUT / 'outro.png')
