'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import dynamic from 'next/dynamic';

// Dynamically import heavy scene components
const CylinderModel    = dynamic(() => import('./CylinderModel'),    { ssr: false });
const PixelParticles   = dynamic(() => import('./PixelParticles'),   { ssr: false });
const BlueprintLabels  = dynamic(() => import('./BlueprintLabels'),  { ssr: false });
const FloatingModules  = dynamic(() => import('./FloatingModules'),  { ssr: false });
const DataFlow         = dynamic(() => import('./DataFlow'),         { ssr: false });
const WarehouseGrid    = dynamic(() => import('./WarehouseGrid'),    { ssr: false });

export default function SceneCanvas() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}        // cap at 1.5x for performance
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 1, 5.5] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 2, // ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        shadows={false}
        style={{ background: '#FAFAFA' }}
      >
        {/* Adaptive performance */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Studio lighting rig */}
        <ambientLight intensity={0.6} color="#FFF8F0" />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.4}
          color="#FFFFFF"
        />
        {/* Orange rim light from below-left */}
        <pointLight
          position={[-3, -1, 2]}
          intensity={0.8}
          color="#FF6A00"
          distance={8}
        />
        {/* Soft fill from right */}
        <pointLight
          position={[4, 2, -2]}
          intensity={0.4}
          color="#F0F0F0"
          distance={10}
        />

        {/* Studio environment — warm white reflections */}
        <Environment preset="studio" environmentIntensity={0.7} />

        <Suspense fallback={null}>
          {/* Pixel particles — assembles into cylinder */}
          <PixelParticles />

          {/* Main hero cylinder */}
          <CylinderModel />

          {/* Blueprint engineering labels */}
          <BlueprintLabels />

          {/* Orbiting ERP module cards */}
          <FloatingModules />

          {/* Orange data flow streams */}
          <DataFlow />

          {/* Warehouse grid of cylinders */}
          <WarehouseGrid />
        </Suspense>
      </Canvas>
    </div>
  );
}
