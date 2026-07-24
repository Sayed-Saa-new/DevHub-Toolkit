"use client";

import { useEffect, useRef } from "react";

/**
 * AsciiWordmark
 * Renders a giant word onto an offscreen canvas, samples its pixels into an
 * ASCII grid, then paints those glyphs on a visible canvas. Cursor hover
 * lights up wandering clusters of cells; scroll-into-view triggers a
 * character-by-character reveal. No external deps.
 */

const ASCII = "........:::=+xX#0369";
const HIGHLIGHT_MS = 320;
const CLUSTER = 10;

interface Cell {
  col: number;
  row: number;
  char: string;
  lit: number; // timestamp until which the cell is highlighted
  revealed: number; // 0..1 progress for scroll-in reveal
}

export function AsciiWordmark({
  text = "DevHub",
  cellSize = 14,
  fontSize = 13,
  charColor = "rgba(255,255,255,0.18)",
  hoverColor = "rgba(255,255,255,0.35)",
  hoverCharColor = "#0a0a0a",
  className,
}: {
  text?: string;
  cellSize?: number;
  fontSize?: number;
  charColor?: string;
  hoverColor?: string;
  hoverCharColor?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let cells: Cell[] = [];
    let cellMap = new Map<string, Cell>();
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let revealStart = 0;
    let revealing = false;
    let revealed = false;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(120, Math.floor(width * 0.22));

      cols = Math.floor(width / cellSize);
      rows = Math.floor(height / cellSize);

      // Sample the word onto an offscreen canvas.
      const sampler = document.createElement("canvas");
      sampler.width = cols;
      sampler.height = rows;
      const sctx = sampler.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.fillStyle = "#000";
      sctx.fillRect(0, 0, cols, rows);
      sctx.fillStyle = "#fff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      // Fit the word into the sample grid.
      let fs = rows;
      sctx.font = `900 ${fs}px "Inter", system-ui, sans-serif`;
      while (sctx.measureText(text).width > cols * 0.98 && fs > 4) {
        fs -= 1;
        sctx.font = `900 ${fs}px "Inter", system-ui, sans-serif`;
      }
      sctx.fillText(text, cols / 2, rows / 2 + 1);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      cells = [];
      cellMap = new Map();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const b = (data[i] + data[i + 1] + data[i + 2]) / (3 * 255);
          if (b < 0.18) continue;
          const idx = Math.min(ASCII.length - 1, Math.floor(b * ASCII.length));
          const cell: Cell = {
            col: c,
            row: r,
            char: ASCII[idx],
            lit: 0,
            revealed: revealed ? 1 : 0,
          };
          cells.push(cell);
          cellMap.set(`${c},${r}`, cell);
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cols * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;
      canvas.style.width = `${cols * cellSize}px`;
      canvas.style.height = `${rows * cellSize}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const highlightCluster = (start: Cell) => {
      const now = performance.now();
      start.lit = now + HIGHLIGHT_MS;
      let cur = start;
      const used = new Set<Cell>([start]);
      const steps = Math.floor(Math.random() * CLUSTER) + 1;
      for (let s = 0; s < steps; s++) {
        const opts: Cell[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const n = cellMap.get(`${cur.col + dx},${cur.row + dy}`);
            if (n && !used.has(n)) opts.push(n);
          }
        }
        if (!opts.length) break;
        const next = opts[Math.floor(Math.random() * opts.length)];
        next.lit = now + HIGHLIGHT_MS + s * 12;
        used.add(next);
        cur = next;
      }
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reveal progress
      if (revealing && !revealed) {
        const t = Math.min(1, (now - revealStart) / 1400);
        // Left-to-right sweep with per-cell easing
        for (const cell of cells) {
          const local = cell.col / Math.max(1, cols - 1);
          const p = Math.max(0, Math.min(1, (t - local * 0.7) * 3));
          cell.revealed = p;
        }
        if (t >= 1) {
          revealed = true;
          for (const c of cells) c.revealed = 1;
        }
      }

      // Pointer highlight
      if (pointer.active) {
        const pc = Math.floor(pointer.x / cellSize);
        const pr = Math.floor(pointer.y / cellSize);
        const radius = 3;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const cell = cellMap.get(`${pc + dx},${pr + dy}`);
            if (cell && Math.random() < 0.25) highlightCluster(cell);
          }
        }
      }

      for (const cell of cells) {
        if (cell.revealed <= 0.01) continue;
        const x = cell.col * cellSize + cellSize / 2;
        const y = cell.row * cellSize + cellSize / 2;
        const isLit = cell.lit > now;
        if (isLit) {
          ctx.fillStyle = hoverColor;
          ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
          ctx.fillStyle = hoverCharColor;
        } else {
          const alpha = cell.revealed;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = charColor;
        }
        ctx.fillText(cell.char, x, y);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    build();
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !revealing) {
            revealing = true;
            revealStart = performance.now();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      revealed = revealed || false;
      build();
    });
    ro.observe(wrap);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text, cellSize, fontSize, charColor, hoverColor, hoverCharColor]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block mx-auto" style={{ touchAction: "none" }} />
    </div>
  );
}
