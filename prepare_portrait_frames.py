from PIL import Image, ImageDraw, ImageFont, ImageOps
from pathlib import Path

ROOT = Path('/home/ubuntu/promptforge')
OUT = ROOT / 'portrait_frames'
OUT.mkdir(exist_ok=True)
ORANGE = '#f97316'
WARM = '#f4efe8'
MUTED = '#aaa39a'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def f(path, size):
    return ImageFont.truetype(path, size)

def title(number, kicker, headline, body, filename):
    image = Image.new('RGB', (720, 1280), '#0b0b0a')
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 720, 14), fill=ORANGE)
    draw.rectangle((58, 180, 68, 480), fill=ORANGE)
    draw.text((98, 190), kicker.upper(), font=f(BOLD, 20), fill=ORANGE)
    draw.multiline_text((98, 260), headline, font=f(BOLD, 54), fill=WARM, spacing=12)
    draw.multiline_text((98, 440), body, font=f(REGULAR, 28), fill=MUTED, spacing=14)
    draw.text((98, 1110), number, font=f(BOLD, 20), fill=ORANGE)
    image.save(OUT / filename)

def mobile_frame(source, filename):
    image = Image.open(source).convert('RGB')
    image = ImageOps.fit(image, (720, 1280), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    image.save(OUT / filename)

mobile_builder = '/home/ubuntu/screenshots/webdev-preview-root-1787051951057213779-3750.png'
mobile_library = '/home/ubuntu/screenshots/webdev-preview-library-1787051955226367000-4543.png'
mobile_frame(mobile_builder, 'builder_mobile.png')
mobile_frame(mobile_library, 'library_mobile.png')

title('01', 'Welcome to PromptForge', 'Forge prompts\nthat ship.', 'A practical mobile workshop for creating\nclear, ready-to-use AI instructions.', 'intro.png')
title('02', 'Step one', 'Choose what\nyou are making.', 'Pick a category that matches your next task.\nNo prompt theory required.', 'choose.png')
title('03', 'Step two', 'Add a few\nuseful details.', 'Tell PromptForge about your project,\naudience, platform, tone, and goal.', 'details.png')
title('04', 'Step three', 'Watch your\nprompt take shape.', 'The live work order turns your choices\ninto a clear, ready-to-use instruction.', 'preview.png')
title('05', 'Step four', 'Browse when\nyou need a head start.', 'Search the mobile Library and filter\nby category or access level.', 'library_card.png')
title('06', 'Make it yours', 'Create an account\nto keep your work.', 'Sign in to save prompts and return\nto your best work later.', 'account.png')
title('07', 'When you are ready', 'Unlock the\nfull workshop.', 'Choose lifetime access to open locked\nwork orders and keep exploring.', 'unlock.png')
title('08', 'You are ready', 'Start building\nin PromptForge.', 'Copy, refine, save, and keep making\nbetter instructions on the go.', 'outro.png')
