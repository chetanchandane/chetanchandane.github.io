import glob, json, os
import numpy as np
from PIL import Image
import dither  # reuse render() + constants

WORK = sorted(glob.glob('work/f*.png'))
OUT = '/Users/chetanchandane/Downloads/chetanchandane.github.io-master/public/hero-galaxy'
os.makedirs(OUT, exist_ok=True)

# ---- Final config (shared with the JS engine) ----
FRAME_W, FRAME_H = 456, 256
COLS = 8
N = len(WORK)
ROWS = (N + COLS - 1)//COLS
CONFIG = dict(
    frameCount=N, sheetCols=COLS, sheetRows=ROWS,
    frameW=FRAME_W, frameH=FRAME_H,
    p2=0.0814, p98=0.9008,
    cell=10, levels=4, spacing=0.5, dotScale=0.74, floor=0.11,
    invert=False,
    mask=dict(cx=0.49, cy=0.50, ax=0.66, ay=0.60, r0=0.60, r1=1.06),
    tint=dict(r=255, g=188, b=120, amt=0.35),
    ground="#0d1116",
    fps=11,
)

# ---- 1) Sprite sheet ----
sheet = Image.new('RGB', (COLS*FRAME_W, ROWS*FRAME_H), (0,0,0))
for idx, f in enumerate(WORK):
    im = Image.open(f).convert('RGB').resize((FRAME_W, FRAME_H), Image.LANCZOS)
    c, r = idx % COLS, idx // COLS
    sheet.paste(im, (c*FRAME_W, r*FRAME_H))
sheet.save(f'{OUT}/galaxy-sheet.jpg', quality=58, optimize=True, progressive=True)
sz = os.path.getsize(f'{OUT}/galaxy-sheet.jpg')
print(f"sheet {sheet.size} -> {sz//1024} KB")

# ---- 2) Pre-dithered poster (load fallback / no-JS) — matches the live engine's
#         final framing (zoom + right-hand anchor + contrast/brightness). ----
GOLD = (255, 188, 120)
# final live settings
ZOOM = 1.45
FOCUS = (0.5, 0.5)      # source point (galaxy core)
ANCHOR = (0.66, 0.48)   # placed here in output
MASK = (0.66, 0.48, 0.82, 0.78, 0.5, 1.18)
OUTW, OUTH = 1280, 700

def zoom_anchor_crop(src, outW, outH):
    """Replicate HeroDither.frameWindow() in frame-pixel space, then resize to output."""
    FW, FH = src.size
    s = max(outW/FW, outH/FH)
    winW = outW/s/ZOOM
    winH = outH/s/ZOOM
    sx = FOCUS[0]*FW - ANCHOR[0]*winW
    sy = FOCUS[1]*FH - ANCHOR[1]*winH
    sx = max(0, min(FW-winW, sx))
    sy = max(0, min(FH-winH, sy))
    return src.crop((round(sx), round(sy), round(sx+winW), round(sy+winH))).resize((outW, outH), Image.LANCZOS)

poster_src = zoom_anchor_crop(Image.open(WORK[20]).convert('RGB'), OUTW, OUTH)
dither.render(f'{OUT}/galaxy-poster.png', poster_src, cell=10, levels=4,
              dotScale=0.88, spacing=0.5, floor=0.10, contrast=1.26, bright=0.18,
              mask=MASK, tint=(GOLD, 0.35))
# recompress poster to jpg (smaller) with dark ground
Image.open(f'{OUT}/galaxy-poster.png').convert('RGB').save(
    f'{OUT}/galaxy-poster.jpg', quality=80, optimize=True, progressive=True)
os.remove(f'{OUT}/galaxy-poster.png')
print("poster ->", os.path.getsize(f'{OUT}/galaxy-poster.jpg')//1024, "KB")

# ---- 3) Config JSON ----
with open(f'{OUT}/galaxy-config.json', 'w') as fh:
    json.dump(CONFIG, fh, indent=2)
print("config:", json.dumps(CONFIG))
print("frames:", N, "grid", COLS, "x", ROWS)
