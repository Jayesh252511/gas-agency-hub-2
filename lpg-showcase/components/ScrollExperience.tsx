'use client';

import dynamic from 'next/dynamic';
import LenisProvider from '@/components/scroll/LenisProvider';
import CursorDot from '@/components/ui/CursorDot';
import ProgressDots from '@/components/ui/ProgressDots';
import NavBar from '@/components/ui/NavBar';
import S1_Birth from '@/components/sections/S1_Birth';
import S2_Reveal from '@/components/sections/S2_Reveal';
import S3_Awakens from '@/components/sections/S3_Awakens';
import S4_OS from '@/components/sections/S4_OS';
import S5_Flow from '@/components/sections/S5_Flow';
import S6_Warehouse from '@/components/sections/S6_Warehouse';
import S7_Analytics from '@/components/sections/S7_Analytics';
import S8_Devices from '@/components/sections/S8_Devices';
import S9_Transform from '@/components/sections/S9_Transform';

// 3D canvas — client-only, no SSR
const SceneCanvas = dynamic(() => import('@/components/scene/SceneCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', inset: 0, background: '#FAFAFA',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1,
    }}>
      <div style={{
        fontFamily: "'VT323', monospace",
        fontSize: '14px',
        color: '#FF6A00',
        letterSpacing: '0.2em',
        animation: 'pulse 1s ease-in-out infinite',
      }}>
        INITIALIZING...
      </div>
    </div>
  ),
});

// GSAP Scroll orchestrator — client only
const ScrollOrchestrator = dynamic(
  () => import('@/components/scroll/ScrollOrchestrator'),
  { ssr: false }
);

export default function ScrollExperience() {
  return (
    <LenisProvider>
      {/* Persistent sticky 3D canvas */}
      <SceneCanvas />

      {/* GSAP scroll timeline controller */}
      <ScrollOrchestrator />

      {/* Custom cursor */}
      <CursorDot />

      {/* Scene position dots */}
      <ProgressDots />

      {/* Fixed navigation */}
      <NavBar />

      {/* Scroll container — 9 × viewport sections stack vertically */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'none', // let canvas receive mouse for future interactions
        }}
      >
        {/* Each section is 100vh and provides HTML overlay content */}
        {/* 3D canvas is driven by scroll progress, not section renders */}
        <S1_Birth />
        <S2_Reveal />
        <S3_Awakens />
        <S4_OS />
        <S5_Flow />
        <S6_Warehouse />
        <S7_Analytics />
        <S8_Devices />
        <S9_Transform />
      </main>
    </LenisProvider>
  );
}
