'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore, SCENES } from '@/lib/scroll-store';

export default function ProgressDots() {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      if (!dotsRef.current) return;
      const dots = dotsRef.current.querySelectorAll('[data-dot]');
      dots.forEach((dot, i) => {
        const el = dot as HTMLDivElement;
        if (i === state.activeScene) {
          el.style.background = '#FF6A00';
          el.style.width = '18px';
          el.style.borderRadius = '2px';
        } else {
          el.style.background = 'rgba(16,16,16,0.18)';
          el.style.width = '6px';
          el.style.borderRadius = '2px';
        }
      });
    });
    return unsub;
  }, []);

  return (
    <div
      ref={dotsRef}
      style={{
        position: 'fixed',
        right: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {SCENES.map((scene, i) => (
        <div
          key={scene.id}
          data-dot={i}
          style={{
            height: 6,
            width: 6,
            borderRadius: 2,
            background: 'rgba(16,16,16,0.18)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
          title={scene.name}
        />
      ))}
    </div>
  );
}
