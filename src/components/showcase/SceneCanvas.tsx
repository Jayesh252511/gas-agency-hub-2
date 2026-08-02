import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import CylinderModel from './CylinderModel';
import PixelParticles from './PixelParticles';
import BlueprintLabels from './BlueprintLabels';
import FloatingModules from './FloatingModules';
import DataFlow from './DataFlow';
import WarehouseGrid from './WarehouseGrid';

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
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 1, 5.5] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 2,
          toneMappingExposure: 1.1,
        }}
        shadows={false}
        style={{ background: '#FAFAFA' }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <ambientLight intensity={0.6} color="#FFF8F0" />
        <directionalLight position={[3, 5, 4]} intensity={1.4} color="#FFFFFF" />
        <pointLight position={[-3, -1, 2]} intensity={0.8} color="#FF6A00" distance={8} />
        <pointLight position={[4, 2, -2]} intensity={0.4} color="#F0F0F0" distance={10} />

        <Environment preset="studio" environmentIntensity={0.7} />

        <Suspense fallback={null}>
          <PixelParticles />
          <CylinderModel />
          <BlueprintLabels />
          <FloatingModules />
          <DataFlow />
          <WarehouseGrid />
        </Suspense>
      </Canvas>
    </div>
  );
}
