import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore, mapRange } from '@/lib/showcase-scroll-store';

const ERP_MODULES = [
  { name: 'Sales',     icon: '↗', color: '#FF6A00', orbitR: 2.2, orbitY: 0.4,  speed: 0.28, phase: 0 },
  { name: 'Stock',     icon: '⬡', color: '#888899', orbitR: 2.4, orbitY: -0.3, speed: 0.22, phase: 1.05 },
  { name: 'Payments',  icon: '₹', color: '#FF6A00', orbitR: 2.0, orbitY: 0.8,  speed: 0.35, phase: 2.09 },
  { name: 'Customers', icon: '◉', color: '#101010', orbitR: 2.5, orbitY: -0.7, speed: 0.18, phase: 3.14 },
  { name: 'Delivery',  icon: '→', color: '#888899', orbitR: 2.1, orbitY: 0.2,  speed: 0.30, phase: 4.19 },
  { name: 'Reports',   icon: '▦', color: '#FF6A00', orbitR: 2.3, orbitY: 0.6,  speed: 0.25, phase: 5.24 },
];

function OrbitalLine({ from, to, opacity }: { from: THREE.Vector3; to: THREE.Vector3; opacity: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([from.x, from.y, from.z, to.x, to.y, to.z]), 3
    ));
    return g;
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  return (
    <line>
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial color="#FF6A00" transparent opacity={opacity * 0.35} />
    </line>
  );
}

export default function FloatingModules() {
  const moduleRefs = useRef<THREE.Group[]>([]);
  const positionsRef = useRef<THREE.Vector3[]>(ERP_MODULES.map(() => new THREE.Vector3()));

  useFrame(({ clock }) => {
    const { modulesVisible, scrollProgress } = useScrollStore.getState();
    const t = clock.getElapsedTime();

    const targetOpacity = modulesVisible
      ? mapRange(scrollProgress, 0.40, 0.45, 0, 1) * mapRange(scrollProgress, 0.70, 0.74, 1, 0)
      : 0;

    ERP_MODULES.forEach((mod, i) => {
      const ref = moduleRefs.current[i];
      if (!ref) return;

      const angle = t * mod.speed + mod.phase;
      const x = Math.cos(angle) * mod.orbitR;
      const z = Math.sin(angle) * mod.orbitR;
      const y = mod.orbitY + Math.sin(t * 0.4 + mod.phase) * 0.1;

      ref.position.set(x, y, z);
      positionsRef.current[i].set(x, y, z);
      ref.rotation.y = -angle;
      ref.visible = targetOpacity > 0.01;
    });
  });

  return (
    <group>
      {ERP_MODULES.map((mod, i) => (
        <group key={mod.name} ref={(el) => { if (el) moduleRefs.current[i] = el; }}>
          <mesh>
            <boxGeometry args={[0.55, 0.36, 0.02]} />
            <meshStandardMaterial
              color="#FAFAFA"
              metalness={0.1}
              roughness={0.9}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh position={[-0.265, 0, 0.015]}>
            <boxGeometry args={[0.02, 0.36, 0.01]} />
            <meshBasicMaterial color={mod.color} />
          </mesh>
          <Html center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div style={{
              width: '86px',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: '10px',
                color: mod.color,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                {mod.icon} {mod.name}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#101010',
                fontWeight: 700,
              }}>
                {mod.name === 'Sales'     ? '₹3,24,580' :
                 mod.name === 'Stock'     ? '142 units' :
                 mod.name === 'Payments'  ? '₹2,18,400' :
                 mod.name === 'Customers' ? '847 active' :
                 mod.name === 'Delivery'  ? '28 today' :
                                           'Jul 2026'}
              </div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                {[40, 65, 45, 80, 60, 90, 55].map((h, j) => (
                  <div key={j} style={{
                    width: '4px',
                    height: `${h * 0.18}px`,
                    background: mod.color,
                    opacity: 0.7,
                  }} />
                ))}
              </div>
            </div>
          </Html>
        </group>
      ))}

      {ERP_MODULES.map((_, i) => (
        <OrbitalLine
          key={`line-${i}`}
          from={positionsRef.current[i] || new THREE.Vector3()}
          to={new THREE.Vector3(0, 0.2, 0)}
          opacity={1}
        />
      ))}
    </group>
  );
}
