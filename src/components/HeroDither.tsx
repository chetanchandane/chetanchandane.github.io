import React, { useEffect, useRef } from "react";
import "../assets/styles/HeroDither.scss";

/**
 * HeroDither — an animated "dithered dot-field" rendering of a rotating galaxy,
 * used as the hero background. A sprite sheet of cleaned source frames is
 * down-sampled into a tiny offscreen buffer each source-frame, then re-drawn as
 * an ordered-dither (8x8 Bayer) field of filled circles whose colour is sampled
 * from the source and warmed toward gold. Pointer motion applies a rotational
 * twist by displacing the *sampling* coordinates (cheap — it happens while
 * reading the already-downscaled buffer).
 *
 * The look was tuned offline; the constants below mirror public/hero-galaxy/galaxy-config.json.
 */

const CFG = {
  sheetSrc: process.env.PUBLIC_URL + "/hero-galaxy/galaxy-sheet.jpg",
  frameCount: 55,
  sheetCols: 8,
  frameW: 456,
  frameH: 256,
  fps: 11,
  crossfade: 9, // frames over which the tail dissolves into the start
  // Pinned auto-levels (2nd/98th luma percentile across the whole sequence).
  p2: 0.0814,
  p98: 0.9008,
  cell: 10, // cell size in CSS px
  levels: 4,
  spacing: 0.5, // fraction of each cell left as gap
  dotScale: 0.88, // dot radius as fraction of the remaining cell
  contrast: 1.26, // pushes the swirl arms apart from the inter-arm gaps
  bright: 0.18, // lift so the galaxy reads bright and glowing
  floor: 0.1, // tones below this clamp to zero (kills background haze)
  // Framing: zoom into the galaxy and anchor its centre in the open right-hand
  // area so the luminous swirl is not hidden behind the headline on the left.
  zoom: 1.45,
  focus: { sx: 0.5, sy: 0.5 }, // source point (the galaxy core) ...
  anchor: { x: 0.66, y: 0.48 }, // ... placed here in the output
  // Radial elliptical vignette (output space, centred on the anchor) — fades the
  // field edges into the ground and suppresses any residual cream.
  mask: { cx: 0.66, cy: 0.48, ax: 0.82, ay: 0.78, r0: 0.5, r1: 1.18 },
  // Warm gold tint, mixed in more strongly for desaturated (cream) pixels.
  tint: { r: 255, g: 188, b: 120, amt: 0.35 },
};

// 8x8 Bayer matrix, normalised to (0,1).
const BAYER = (() => {
  const build = (n: number): number[][] => {
    if (n === 1) return [[0]];
    const s = build(n / 2);
    const m: number[][] = [];
    const h = s.length;
    for (let y = 0; y < n; y++) m.push(new Array(n).fill(0));
    for (let y = 0; y < h; y++)
      for (let x = 0; x < h; x++) {
        const v = s[y][x];
        m[y][x] = 4 * v;
        m[y][x + h] = 4 * v + 2;
        m[y + h][x] = 4 * v + 3;
        m[y + h][x + h] = 4 * v + 1;
      }
    return m;
  };
  const m = build(8);
  return m.map((row) => row.map((v) => (v + 0.5) / 64));
})();

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Props = { active?: boolean };

export default function HeroDither({ active = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- offscreen down-sample buffer (one pixel per cell) ---
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d", { willReadFrequently: true })!;

    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let cellPx = CFG.cell; // device px per cell
    // per source-cell tone (0..1) and colour, recomputed when the frame advances
    let tone = new Float32Array(0);
    let colR = new Float32Array(0);
    let colG = new Float32Array(0);
    let colB = new Float32Array(0);
    let mask = new Float32Array(0);

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      cellPx = CFG.cell * dpr;
      cols = Math.max(1, Math.round(canvas!.width / cellPx));
      rows = Math.max(1, Math.round(canvas!.height / cellPx));
      buf.width = cols;
      buf.height = rows;
      const n = cols * rows;
      tone = new Float32Array(n);
      colR = new Float32Array(n);
      colG = new Float32Array(n);
      colB = new Float32Array(n);
      mask = new Float32Array(n);
      // precompute the elliptical mask in source space (per cell)
      const m = CFG.mask;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const nx = (i / cols - m.cx) / m.ax;
          const ny = (j / rows - m.cy) / m.ay;
          const nr = Math.sqrt(nx * nx + ny * ny);
          mask[j * cols + i] = smoothstep(m.r1, m.r0, nr);
        }
      }
    }

    // source sub-window for one sheet frame: cover, then zoom, then anchor the
    // galaxy core (focus point) at the desired output position.
    function frameWindow() {
      const s = Math.max(cols / CFG.frameW, rows / CFG.frameH);
      const winW = cols / s / CFG.zoom;
      const winH = rows / s / CFG.zoom;
      let sx = CFG.focus.sx * CFG.frameW - CFG.anchor.x * winW;
      let sy = CFG.focus.sy * CFG.frameH - CFG.anchor.y * winH;
      sx = Math.max(0, Math.min(CFG.frameW - winW, sx));
      sy = Math.max(0, Math.min(CFG.frameH - winH, sy));
      return { sx, sy, winW, winH };
    }

    function drawFrameToBuffer(idx: number, alpha: number) {
      const c = idx % CFG.sheetCols;
      const r = Math.floor(idx / CFG.sheetCols);
      const { sx, sy, winW, winH } = frameWindow();
      bctx.globalAlpha = alpha;
      bctx.drawImage(
        sheet,
        c * CFG.frameW + sx,
        r * CFG.frameH + sy,
        winW,
        winH,
        0,
        0,
        cols,
        rows
      );
      bctx.globalAlpha = 1;
    }

    // Recompute tone[]/colour[] for a given source frame (with crossfade tail).
    function computeFrame(fk: number) {
      drawFrameToBuffer(fk, 1);
      // crossfade the tail into the opening frames so the loop is seamless
      const tailStart = CFG.frameCount - CFG.crossfade;
      if (fk >= tailStart) {
        const o = fk - tailStart; // 0..crossfade-1
        const a = (o + 1) / (CFG.crossfade + 1);
        drawFrameToBuffer(o, a);
      }
      const img = bctx.getImageData(0, 0, cols, rows).data;
      const range = CFG.p98 - CFG.p2;
      const t255 = CFG.tint;
      for (let p = 0, q = 0; p < cols * rows; p++, q += 4) {
        const r = img[q];
        const g = img[q + 1];
        const b = img[q + 2];
        // Rec.709 luma, normalised
        let L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        L = (L - CFG.p2) / range;
        L = L < 0 ? 0 : L > 1 ? 1 : L;
        L = (L - 0.5) * CFG.contrast + 0.5 + CFG.bright;
        L = L < 0 ? 0 : L > 1 ? 1 : L;
        L *= mask[p];
        if (L < CFG.floor) L = 0;
        tone[p] = L;
        // warm tint — mix toward gold, more for desaturated (cream) pixels
        const mx = Math.max(r, g, b);
        const mn = Math.min(r, g, b);
        const sat = mx === 0 ? 0 : (mx - mn) / mx;
        const a =
          CFG.tint.amt * (1 - Math.min(sat / 0.35, 1)) + CFG.tint.amt * 0.35;
        colR[p] = r * (1 - a) + t255.r * a;
        colG[p] = g * (1 - a) + t255.g * a;
        colB[p] = b * (1 - a) + t255.b * a;
      }
    }

    // --- pointer state (rotational twist about the cursor) ---
    const pointer = { x: -1, y: -1, amp: 0, target: 0 };
    let dirty = true; // request a redraw (pointer moved / resized)
    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * cols;
      pointer.y = ((e.clientY - rect.top) / rect.height) * rows;
      pointer.target = 1;
      dirty = true;
    };
    const onLeave = () => {
      pointer.target = 0;
      dirty = true;
    };

    const maxR = (cellPx * (1 - CFG.spacing)) / 2 * CFG.dotScale;
    const warpRadius = () => 0.6 * Math.max(cols, rows); // ~60% of canvas
    const TWIST = 0.9; // max twist in radians at the cursor

    function render() {
      // background = ground colour
      ctx!.fillStyle = "#0b0d10";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      const useWarp = pointer.amp > 0.001 && pointer.x >= 0;
      const R = warpRadius();

      // bucket cells by quantised colour so fillStyle is set only a few dozen
      // times per frame instead of once per dot
      const buckets = new Map<number, number[]>();
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let si = i;
          let sj = j;
          if (useWarp) {
            const dx = i - pointer.x;
            const dy = j - pointer.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < R) {
              const f = smoothstep(0, 1, 1 - d / R);
              const ang = f * TWIST * pointer.amp;
              const cs = Math.cos(ang);
              const sn = Math.sin(ang);
              si = pointer.x + dx * cs - dy * sn;
              sj = pointer.y + dx * sn + dy * cs;
            }
          }
          let ii = si | 0;
          let jj = sj | 0;
          if (ii < 0) ii = 0;
          else if (ii >= cols) ii = cols - 1;
          if (jj < 0) jj = 0;
          else if (jj >= rows) jj = rows - 1;
          const sp = jj * cols + ii;
          const L = tone[sp];
          if (L <= 0) continue;
          // ordered-dither quantisation into N levels (Bayer in screen space)
          const v = L * (CFG.levels - 1);
          const base = Math.floor(v);
          const frac = v - base;
          let lvl = base + (frac > BAYER[j & 7][i & 7] ? 1 : 0);
          if (lvl <= 0) continue;
          if (lvl > CFG.levels - 1) lvl = CFG.levels - 1;
          const rad = maxR * (lvl / (CFG.levels - 1));
          if (rad < 0.35) continue;
          const key =
            ((colR[sp] >> 4) << 8) | ((colG[sp] >> 4) << 4) | (colB[sp] >> 4);
          let arr = buckets.get(key);
          if (!arr) buckets.set(key, (arr = []));
          arr.push((i + 0.5) * cellPx, (j + 0.5) * cellPx, rad);
        }
      }

      buckets.forEach((arr, key) => {
        const r = (((key >> 8) & 15) << 4) | 8;
        const g = (((key >> 4) & 15) << 4) | 8;
        const b = ((key & 15) << 4) | 8;
        ctx!.fillStyle = `rgb(${r},${g},${b})`;
        ctx!.beginPath();
        for (let k = 0; k < arr.length; k += 3) {
          const x = arr[k];
          const y = arr[k + 1];
          const rad = arr[k + 2];
          ctx!.moveTo(x + rad, y);
          ctx!.arc(x, y, rad, 0, Math.PI * 2);
        }
        ctx!.fill();
      });
    }

    // --- driver ---
    let raf = 0;
    let start = 0;
    let lastFrame = -1;
    let running = true;

    function tick(ts: number) {
      if (!running) return;
      if (!start) start = ts;
      // advance the pointer-warp amplitude every frame (independent of drawing)
      pointer.amp += (pointer.target - pointer.amp) * 0.08;
      const easing = Math.abs(pointer.target - pointer.amp) > 0.002;
      const fk =
        Math.floor(((ts - start) / 1000) * CFG.fps) % CFG.frameCount;
      const frameChanged = fk !== lastFrame;
      if (frameChanged) {
        computeFrame(fk);
        lastFrame = fk;
      }
      // Only redraw when something changed: the source frame advanced (~11fps),
      // the pointer moved, or the warp is still easing in/out. When idle this
      // drops the loop from 60fps of redraws to ~11fps.
      if (frameChanged || dirty || easing) {
        render();
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    }

    let sheet: HTMLImageElement;
    function begin() {
      layout();
      if (reduceMotion) {
        // static: one representative frame, no animation, no pointer warp
        computeFrame(20 % CFG.frameCount);
        render();
        return;
      }
      window.addEventListener("pointermove", onMove);
      wrap!.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(tick);
    }

    let ro: ResizeObserver | null = null;
    sheet = new Image();
    sheet.decoding = "async";
    sheet.src = CFG.sheetSrc;
    sheet.onload = () => {
      wrap!.classList.add("hero-dither--ready");
      begin();
      ro = new ResizeObserver(() => {
        layout();
        if (reduceMotion) {
          computeFrame(20 % CFG.frameCount);
          render();
        } else {
          lastFrame = -1; // force recompute at new size
        }
      });
      ro.observe(wrap!);
    };

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      wrap!.removeEventListener("pointerleave", onLeave);
      if (ro) ro.disconnect();
    };
  }, [active]);

  return (
    <div
      className="hero-dither"
      ref={wrapRef}
      aria-hidden="true"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/hero-galaxy/galaxy-poster.jpg)`,
      }}
    >
      <canvas ref={canvasRef} className="hero-dither__canvas" />
    </div>
  );
}
