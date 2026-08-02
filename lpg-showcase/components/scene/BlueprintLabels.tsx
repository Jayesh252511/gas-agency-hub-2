'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore, mapRange } from '@/lib/scroll-store';


interface Label {
  position: [number, number, number];
  text: string;
  value: string;
}

const LABELS: Label[] = [
  { position: [1.1, 0.8,  0], text: 'BODY DIA',       value: '148.5mm' },
  { position: [1.1, -0.8, 0], text: 'HEIGHT',          value: '485mm'   },
  { position: [-1.2, 0.2, 0], text: 'TARE WEIGHT',     value: '16.4 kg' },
  { position: [0.0, 2.1,  0], text: 'VALVE TYPE',      value: 'IS 8737'  },
  { position: [1.0, -1.4, 0], text: 'WORKING PRES',    value: '7.5 bar'  },
  { position: [-0.9, 1.1, 0], text: 'MATERIAL',        value: 'BS 1501'  },
];

function makeLine(from: THREE.Vector3, to: THREE.Vector3) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array([from.x, from.y, from.z, to.x, to.y, to.z]), 3
  ));
  return geo;
}

export default function BlueprintLabels() {
  const groupRef = useRef<THREE.Group>(null);

  const lineGeos = useMemo(() =>
    LABELS.map((label) => {
      const pos = new THREE.Vector3(...label.position);
      const dir = pos.clone().normalize();
      const surface = dir.clone().multiplyScalar(0.80);
      return makeLine(pos.clone().multiplyScalar(0.88), surface);
    }), []
  );

  const gridGeos = useMemo(() =>
    [-1.2, -0.6, 0, 0.6, 1.2].map((y) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([-1.5, y, 0, 1.5, y, 0]), 3
      ));
      return geo;
    }), []
  );

  return (
    <group ref={groupRef}>
      {LABELS.map((label, i) => {
        const pos = new THREE.Vector3(...label.position);
        const dir = pos.clone().normalize();
        const surface = dir.clone().multiplyScalar(0.80);

        return (
          <group key={i}>
            {/* Measurement line */}
            <line>
              <primitive object={lineGeos[i]} attach="geometry" />
              <lineBasicMaterial color="#FF6A00" transparent opacity={0.5} />
            </line>

            {/* Dot at surface */}
            <mesh position={surface.toArray() as [number, number, number]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshBasicMaterial color="#FF6A00" />
            </mesh>

            {/* HTML annotation */}
            <Html position={label.position} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '9px',
                  color: '#FF6A00',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}>{label.text}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#101010',
                  fontWeight: 700,
                  background: 'rgba(250,250,250,0.9)',
                  padding: '2px 6px',
                  border: '1px solid rgba(255,106,0,0.3)',
                }}>{label.value}</div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Grid lines */}
      {gridGeos.map((geo, i) => (
        <line key={`grid-${i}`}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color="#FF6A00" transparent opacity={0.08} />
        </line>
      ))}
    </group>
  );
}
