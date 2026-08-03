# Hero galaxy — dithered dot-field assets

The hero background (`src/components/HeroDither.tsx`) renders a **live canvas dither**
of a rotating galaxy: source frames are down-sampled into a tiny buffer and redrawn as
an 8×8-Bayer ordered-dither field of gold circles on the `#0d1116` ground, with a
rotational-twist pointer interaction. This folder regenerates the two runtime assets in
`public/hero-galaxy/`:

- `galaxy-sheet.jpg` — 55-frame sprite sheet (8 cols × 7 rows, 456×256 per frame) the
  engine plays at 11fps and crossfades to loop.
- `galaxy-poster.jpg` — a pre-dithered still used as the CSS load fallback / no-JS view.

## Source

A ~5s 4K clip of an AI-generated rotating galaxy (sepia/gold stars + dust on a cream
parchment ground, with a painted border). The technique needs a subject made of many
small discrete elements (a solid object dithers into a grey blob).

## Regenerating

Requires `ffmpeg`, Python with `pillow` + `numpy`.

```bash
# 1. Extract cleaned frames: 11fps, crop off the ~8% painted parchment border, scale.
ffmpeg -i galaxy.mp4 -vf "fps=11,crop=iw*0.84:ih*0.84:iw*0.08:ih*0.08,scale=900:-2" work/f%03d.png

# 2. (optional) recompute the pinned auto-levels; the current values (p2≈20.8, p98≈229.7
#    of 255) are baked into both dither.py and HeroDither.tsx — recompute if the source
#    changes, or the dot density will pulse.

# 3. Build the sprite sheet + poster into ../../public/hero-galaxy/
python3 gen_assets.py
```

## Keeping the look in sync

`dither.py` (offline preview/poster) and the `CFG` block in
`src/components/HeroDither.tsx` (runtime) implement the **same** pipeline. If you change
the look, change both: pinned levels, `cell/levels/spacing/dotScale/floor/contrast`,
the `zoom`/`anchor` framing, the elliptical mask, and the warm gold `tint`.
