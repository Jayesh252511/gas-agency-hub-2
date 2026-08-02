import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore, mapRange } from '@/lib/showcase-scroll-store';

const ROWS = 4;
const COLS = 8;
const SPACING_X = 2.0;
const SPACING_Z = 2.2;

export default function WarehouseGrid() {
  const groupRef = useRef<THREE.Group>(null);

  const cylinderGeo = useMemo(() => {
    const points = [
      new THREE.Vector2(0.0, -0.5),
      new THREE.Vector2(0.24, -0.5),
      new THREE.Vector2(0.25, -0.3),
      new THREE.Vector2(0.25, 0.28),
      new THREE.Vector2(0.22, 0.40),
      new THREE.Vector2(0.12, 0.46),
      new THREE.Vector2(0.08, 0.52),
      new THREE.Vector2(0.00, 0.52),
    ];
    return new THREE.LatheGeometry(points, 20);
  }, []);

  const baseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B0B8C0'),
    metalness: 0.8,
    roughness: 0.3,
  }), []);

  const stripeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FF6A00'),
    metalness: 0.4,
    roughness: 0.5,
  }), []);

  useFrame(() => {
    const { warehouseVisible, scrollProgress } = useScrollStore.getState();
    if (!groupRef.current) return;

    const visible = warehouseVisible;
    const fadeIn = mapRange(scrollProgress, 0.72, 0.76, 0, 1);
    const fadeOut = mapRange(scrollProgress, 0.82, 0.84, 1, 0);
    const opacity = fadeIn * fadeOut;

    groupRef.current.visible = visible && opacity > 0.01;
  });

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr.push([
          (c - COLS / 2) * SPACING_X,
          0,
          (r - ROWS / 2) * SPACING_Z,
        ]);
      }
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef} position={[0, -1.5, -3]} scale={[0.7, 0.7, 0.7]}>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh geometry={cylinderGeo} material={baseMat} />
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.252, 0.252, 0.06, 20, 1, true]} />
            <primitive object={stripeMat} attach="material" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
            <circleGeometry args={[0.35, 12]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.08} />
          </mesh>
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
        <planeGeometry args={[COLS * SPACING_X + 2, ROWS * SPACING_Z + 2, COLS + 2, ROWS + 2]} />
        <meshBasicMaterial color="#EAEAEA" wireframe transparent opacity={0.4} />
      </mesh>

      <ScanLine />
    </group>
  );
}

function ScanLine() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = (clock.getElapsedTime() * 0.5) % 1;
    const z = -ROWS * SPACING_Z / 2 + t * ROWS * SPACING_Z;
    meshRef.current.position.z = z;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.50, 0]}>
      <planeGeometry args={[COLS * SPACING_X + 1, 0.06]} />
      <meshBasicMaterial color="#FF6A00" transparent opacity={0.5} />
    </mesh>
  );
}
