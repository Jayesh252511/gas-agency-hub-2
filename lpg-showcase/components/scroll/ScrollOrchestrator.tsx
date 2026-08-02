'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore, mapRange, SCENES } from '@/lib/scroll-store';

export default function ScrollOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useScrollStore.getState();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Master scroll progress tracker
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress;
        useScrollStore.getState().setScrollProgress(p);

        // Determine active scene
        const scene = SCENES.findIndex((s) => p >= s.start && p < s.end);
        useScrollStore.getState().setActiveScene(Math.max(0, scene === -1 ? 8 : scene));

        // ── SCENE 0: Birth (0–12%) ──────────────────────────────────────
        if (p <= 0.12) {
          const t = mapRange(p, 0, 0.12, 0, 1);
          useScrollStore.getState().setCylinder({
            particleProgress: t,
            wireframeOpacity: mapRange(t, 0.3, 1.0, 1, 0),
            scale: mapRange(t, 0.1, 1, 0.01, 1),
            posY: mapRange(t, 0, 1, -1.5, 0),
          });
          useScrollStore.getState().setCamera({
            azimuth: 0, elevation: 15, distance: 5.5,
            targetX: 0, targetY: 0, targetZ: 0,
          });
        }

        // ── SCENE 1: Reveal (12–25%) ────────────────────────────────────
        if (p >= 0.12 && p <= 0.25) {
          const t = mapRange(p, 0.12, 0.25, 0, 1);
          useScrollStore.getState().setCylinder({
            particleProgress: 1,
            wireframeOpacity: 0,
            scale: 1,
            rotationY: t * Math.PI * 2,
            posY: 0,
          });
          useScrollStore.getState().setCamera({
            azimuth: t * 180,
            elevation: mapRange(t, 0, 1, 15, 5),
            distance: mapRange(t, 0, 0.5, 5.5, 2.5),
            targetX: 0, targetY: mapRange(t, 0.5, 1, 0, 0.5), targetZ: 0,
          });
        }

        // ── SCENE 2: Awakens (25–40%) ───────────────────────────────────
        if (p >= 0.25 && p <= 0.40) {
          const t = mapRange(p, 0.25, 0.40, 0, 1);
          useScrollStore.getState().setCylinder({
            particleProgress: 1,
            scale: 1,
            rotationY: t * 0.5,
            posY: Math.sin(t * Math.PI) * 0.3,
            valveRotation: t * Math.PI * 2,
            emissiveIntensity: t * 0.4,
          });
          useScrollStore.getState().setCamera({
            azimuth: mapRange(t, 0, 1, 180, 270),
            elevation: mapRange(t, 0, 1, 5, 20),
            distance: mapRange(t, 0, 1, 2.5, 4.5),
            targetX: 0, targetY: 0, targetZ: 0,
          });
        }

        // ── SCENE 3: OS (40–58%) ────────────────────────────────────────
        if (p >= 0.40 && p <= 0.58) {
          const t = mapRange(p, 0.40, 0.58, 0, 1);
          useScrollStore.getState().setModulesVisible(t > 0.1);
          useScrollStore.getState().setCylinder({
            posY: 0.2,
            rotationY: t * 0.8,
            emissiveIntensity: 0.3,
          });
          useScrollStore.getState().setCamera({
            azimuth: 270 + t * 30,
            elevation: 25,
            distance: mapRange(t, 0, 0.3, 4.5, 6.0),
            targetX: 0, targetY: 0.2, targetZ: 0,
          });
        }

        // ── SCENE 4: Flow (58–72%) ──────────────────────────────────────
        if (p >= 0.58 && p <= 0.72) {
          const t = mapRange(p, 0.58, 0.72, 0, 1);
          useScrollStore.getState().setDataFlowVisible(t > 0.05);
          useScrollStore.getState().setModulesVisible(t < 0.5);
          useScrollStore.getState().setCamera({
            azimuth: 300 + t * 60,
            elevation: 20,
            distance: 6.5,
            targetX: 0, targetY: 0, targetZ: 0,
          });
        }

        // ── SCENE 5: Warehouse (72–84%) ─────────────────────────────────
        if (p >= 0.72 && p <= 0.84) {
          const t = mapRange(p, 0.72, 0.84, 0, 1);
          useScrollStore.getState().setWarehouseVisible(true);
          useScrollStore.getState().setDataFlowVisible(false);
          useScrollStore.getState().setCamera({
            azimuth: 360 + t * 40,
            elevation: mapRange(t, 0, 1, 20, 35),
            distance: mapRange(t, 0, 1, 6.5, 12),
            targetX: t * 3,
            targetY: -0.5,
            targetZ: t * -2,
          });
        }

        // ── SCENE 6: Analytics (84–94%) ─────────────────────────────────
        if (p >= 0.84 && p <= 0.94) {
          const t = mapRange(p, 0.84, 0.94, 0, 1);
          useScrollStore.getState().setWarehouseVisible(false);
          useScrollStore.getState().setAnalyticsVisible(true);
          useScrollStore.getState().setCylinder({
            posY: 0, rotationY: t * 0.3,
          });
          useScrollStore.getState().setCamera({
            azimuth: 400 + t * 30,
            elevation: 15,
            distance: mapRange(t, 0, 1, 12, 4.5),
            targetX: 0, targetY: 0, targetZ: 0,
          });
        }

        // ── SCENE 7+8: Devices + Transform (94–100%) ────────────────────
        if (p >= 0.94) {
          const t = mapRange(p, 0.94, 1.0, 0, 1);
          useScrollStore.getState().setAnalyticsVisible(false);
          useScrollStore.getState().setFinalTextVisible(t > 0.3);
          useScrollStore.getState().setCylinder({
            particleProgress: mapRange(t, 0.5, 1.0, 1, 0),
            scale: mapRange(t, 0.7, 1.0, 1, 0),
            emissiveIntensity: mapRange(t, 0, 0.5, 0.3, 1.2),
          });
          useScrollStore.getState().setCamera({
            azimuth: 430,
            elevation: 20,
            distance: mapRange(t, 0, 1, 4.5, 8),
            targetX: 0, targetY: 0, targetZ: 0,
          });
        }
      },
    });

    return () => ScrollTrigger.killAll();
  }, []);

  return <div ref={containerRef} />;
}
