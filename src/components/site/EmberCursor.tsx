"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export function EmberCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const sparks = useRef<Spark[]>([]);
  const mouse = useRef({ x: -999, y: -999, vx: 0, vy: 0, px: 0, py: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const m = mouse.current;
      m.vx = e.clientX - m.px;
      m.vy = e.clientY - m.py;
      m.px = m.x;
      m.py = m.y;
      m.x = e.clientX;
      m.y = e.clientY;

      // Emit sparks based on speed
      const speed = Math.sqrt(m.vx ** 2 + m.vy ** 2);
      const count = Math.min(Math.floor(speed / 6), 6);
      for (let i = 0; i < count; i++) {
        sparks.current.push({
          x: m.x + (Math.random() - 0.5) * 6,
          y: m.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 3 - m.vx * 0.08,
          vy: (Math.random() - 0.5) * 3 - Math.abs(m.vy) * 0.08 - 1.5,
          life: 1,
          maxLife: 0.5 + Math.random() * 0.5,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = sparks.current;
      for (let i = now.length - 1; i >= 0; i--) {
        const s = now[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // gravity
        s.vx *= 0.96;
        s.life -= 0.035 / s.maxLife;

        if (s.life <= 0) {
          now.splice(i, 1);
          continue;
        }

        const t = s.life;
        // Color: ember orange → warm red → transparent
        const r = 255;
        const g = Math.round(t > 0.5 ? 107 + (t - 0.5) * 2 * 80 : t * 2 * 107);
        const a = t * 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},20,${a})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
