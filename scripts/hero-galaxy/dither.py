import numpy as np, glob, math
from PIL import Image, ImageDraw

FILES = sorted(glob.glob('work/f*.png'))
P2, P98 = 20.76/255.0, 229.70/255.0   # PINNED levels
GROUND = (11, 13, 16)                  # #0d1116

# 8x8 Bayer matrix (values 0..63) -> normalized [0,1)
def bayer_n(n):
    if n == 1: return np.array([[0]])
    s = bayer_n(n//2)
    return np.block([[4*s, 4*s+2],[4*s+3, 4*s+1]])
BAYER8 = bayer_n(8).astype(np.float32)
BAYER8 = (BAYER8 + 0.5) / 64.0         # in (0,1)

def luma(a):
    return 0.2126*a[...,0] + 0.7152*a[...,1] + 0.0722*a[...,2]

def render(fname, src_img, cell=8, levels=5, spacing=0.42, dotScale=0.85,
           invert=False, floor=0.06, contrast=1.0, bright=0.0, mask=None,
           tint=None, out_scale=1):
    src = src_img.convert('RGB')
    W, H = src.size
    outW, outH = W*out_scale, H*out_scale
    cols, rows = outW // cell, outH // cell
    # downscale buffer (area average)
    buf = src.resize((cols, rows), Image.BOX)
    arr = np.asarray(buf, dtype=np.float32) / 255.0
    L = luma(arr)
    # auto-level (pinned)
    t = (L - P2) / (P98 - P2)
    t = np.clip(t, 0, 1)
    # contrast around 0.5 + brightness
    if contrast != 1.0 or bright != 0.0:
        t = np.clip((t - 0.5) * contrast + 0.5 + bright, 0, 1)
    if invert:
        t = 1.0 - t
    # radial elliptical mask
    if mask is not None:
        cx, cy, ax, ay, r0, r1 = mask
        yy, xx = np.mgrid[0:rows, 0:cols].astype(np.float32)
        nx = (xx/cols - cx)/ax
        ny = (yy/rows - cy)/ay
        nr = np.sqrt(nx*nx + ny*ny)
        m = np.clip((r1 - nr)/(r1 - r0), 0, 1)
        m = m*m*(3-2*m)  # smoothstep
        t = t * m
    # floor clamp
    t = np.where(t < floor, 0.0, t)
    # ordered dither into N levels
    v = t * (levels - 1)
    base = np.floor(v)
    frac = v - base
    lvl = base + (frac > BAYER8[np.arange(rows)[:,None] % 8, np.arange(cols)[None,:] % 8]).astype(np.float32)
    lvl = np.clip(lvl, 0, levels-1)
    # draw
    canvas = Image.new('RGB', (outW, outH), GROUND)
    d = ImageDraw.Draw(canvas)
    rgb255 = (arr*255)
    maxr = (cell*(1-spacing)/2)*dotScale
    for j in range(rows):
        for i in range(cols):
            l = lvl[j, i]
            if l <= 0: continue
            r = maxr * (l/(levels-1))
            if r < 0.4: continue
            cxp = i*cell + cell/2
            cyp = j*cell + cell/2
            cr, cg, cb = rgb255[j,i]
            # tint: mix dot color toward a warm gold by amount, stronger for desaturated (cream) pixels
            if tint is not None:
                tc, amt = tint
                mx = max(cr, cg, cb); mn = min(cr, cg, cb)
                sat = 0 if mx == 0 else (mx - mn)/mx
                a = amt * (1.0 - min(sat/0.35, 1.0)) + amt*0.35  # more mix when low saturation
                cr = cr*(1-a) + tc[0]*a
                cg = cg*(1-a) + tc[1]*a
                cb = cb*(1-a) + tc[2]*a
            d.ellipse([cxp-r, cyp-r, cxp+r, cyp+r], fill=(int(cr), int(cg), int(cb)))
    canvas.save(fname)
    return fname

GOLD = (255, 188, 120)

if __name__ == '__main__':
    src = Image.open(FILES[20])
    # tuned mask centered near middle, wide ellipse so all four corners fall in falloff
    MASK = (0.49, 0.50, 0.66, 0.60, 0.60, 1.06)
    # airy winner direction + tuned mask + warm gold tint
    render('ref_1_airy.png',  src, cell=10, levels=4, dotScale=0.74, spacing=0.5,
           floor=0.11, mask=MASK, tint=(GOLD, 0.35))
    render('ref_2_softer.png', src, cell=11, levels=4, dotScale=0.70, spacing=0.52,
           floor=0.13, mask=MASK, tint=(GOLD, 0.45))
    render('ref_3_denser.png', src, cell=9, levels=5, dotScale=0.80, spacing=0.44,
           floor=0.09, mask=MASK, tint=(GOLD, 0.30))
    # a tighter mask variant to fully kill corners
    MASK2 = (0.49, 0.50, 0.62, 0.56, 0.52, 0.98)
    render('ref_4_tightmask.png', src, cell=10, levels=4, dotScale=0.74, spacing=0.5,
           floor=0.11, mask=MASK2, tint=(GOLD, 0.40))
    print("done")
