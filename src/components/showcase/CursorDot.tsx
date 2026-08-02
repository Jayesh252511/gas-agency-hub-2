import { useEffect, useRef } from 'react';

export default function CursorDot() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    let raf: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: 1,
          background: '#FF6A00', zIndex: 9999, pointerEvents: 'none',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          border: '1px dashed rgba(255,106,0,0.4)', borderRadius: '50%',
          zIndex: 9998, pointerEvents: 'none',
        }}
      />
    </>
  );
}
