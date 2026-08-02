import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/showcase-scroll-store';

function getCylinderPoints(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.00, -1.60),
    new THREE.Vector2(0.72, -1.60),
    new THREE.Vector2(0.74, -1.50),
    new THREE.Vector2(0.75, -1.20),
    new THREE.Vector2(0.75,  0.80),
    new THREE.Vector2(0.73,  0.95),
    new THREE.Vector2(0.60,  1.20),
    new THREE.Vector2(0.40,  1.35),
    new THREE.Vector2(0.28,  1.42),
    new THREE.Vector2(0.28,  1.65),
    new THREE.Vector2(0.22,  1.70),
    new THREE.Vector2(0.18,  1.72),
    new THREE.Vector2(0.00,  1.72),
  ];
}

export default function CylinderModel() {
  const groupRef = useRef<THREE.Group>(null);
  const valveRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null);
  const { camera } = useThree();

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B8C4CC'),
    metalness: 0.88,
    roughness: 0.22,
    envMapIntensity: 1.2,
  }), []);

  const stripeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FF6A00'),
    metalness: 0.5,
    roughness: 0.35,
    emissive: new THREE.Color('#FF6A00'),
    emissiveIntensity: 0,
  }), []);

  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FF6A00'),
    wireframe: true,
    transparent: true,
    opacity: 1,
  }), []);

  const valveMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2A2A2A'),
    metalness: 0.9,
    roughness: 0.15,
  }), []);

  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#888899'),
    metalness: 0.7,
    roughness: 0.4,
  }), []);

  const bodyGeometry = useMemo(() => new THREE.LatheGeometry(getCylinderPoints(), 64), []);
  const stripeGeometry = useMemo(() => new THREE.CylinderGeometry(0.758, 0.758, 0.18, 64, 1, true), []);
  const valveWheelGeometry = useMemo(() => new THREE.TorusGeometry(0.20, 0.035, 8, 32), []);
  const handleGeometry = useMemo(() => new THREE.TorusGeometry(0.28, 0.038, 8, 24, Math.PI), []);
  const baseRingGeometry = useMemo(() => new THREE.TorusGeometry(0.68, 0.05, 8, 48), []);

  useFrame(({ clock }) => {
    const state = useScrollStore.getState();
    const { cylinder } = state;
    const t = clock.getElapsedTime();

    if (!groupRef.current) return;

    const targetScale = cylinder.scale;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    groupRef.current.position.y += (cylinder.posY - groupRef.current.position.y) * 0.06;
    groupRef.current.rotation.y += (cylinder.rotationY - groupRef.current.rotation.y) * 0.04;

    const breath = Math.sin(t * 0.6) * 0.015;
    groupRef.current.position.y += breath;

    if (valveRef.current) {
      valveRef.current.rotation.y += (cylinder.valveRotation - valveRef.current.rotation.y) * 0.05;
    }

    if (wireRef.current) {
      (wireRef.current.material as THREE.MeshBasicMaterial).opacity = cylinder.wireframeOpacity;
    }

    if (emissiveRef.current) {
      emissiveRef.current.emissiveIntensity += (cylinder.emissiveIntensity - emissiveRef.current.emissiveIntensity) * 0.05;
    }

    const { azimuth, elevation, distance, targetX, targetY, targetZ } = state.camera;
    const azRad = (azimuth * Math.PI) / 180;
    const elRad = (elevation * Math.PI) / 180;

    const camX = Math.sin(azRad) * Math.cos(elRad) * distance;
    const camY = Math.sin(elRad) * distance;
    const camZ = Math.cos(azRad) * Math.cos(elRad) * distance;

    camera.position.x += (camX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z += (camZ - camera.position.z) * 0.04;
    camera.lookAt(targetX, targetY, targetZ);
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]} position={[0, -0.5, 0]}>
      <mesh geometry={bodyGeometry} material={bodyMaterial} />
      <mesh ref={wireRef} geometry={bodyGeometry} material={wireMaterial} scale={[1.002, 1.002, 1.002]} />
      <mesh geometry={stripeGeometry} position={[0, 0.1, 0]}>
        <primitive object={stripeMaterial} ref={emissiveRef} attach="material" />
      </mesh>
      <mesh geometry={stripeGeometry} position={[0, -0.15, 0]} material={stripeMaterial} />
      <mesh geometry={baseRingGeometry} position={[0, -1.62, 0]} rotation={[Math.PI / 2, 0, 0]} material={valveMaterial} />

      <group ref={valveRef} position={[0, 1.68, 0]}>
        <mesh material={valveMaterial}>
          <cylinderGeometry args={[0.07, 0.09, 0.20, 16]} />
        </mesh>
        <mesh geometry={valveWheelGeometry} material={valveMaterial} position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} />
        {[0, 90, 180, 270].map((deg) => (
          <mesh key={deg} material={valveMaterial} rotation={[Math.PI / 2, 0, (deg * Math.PI) / 180]}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
          </mesh>
        ))}
        <mesh position={[0.12, 0.05, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#FF6A00" emissive="#FF6A00" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      </group>

      <mesh geometry={handleGeometry} position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} material={handleMaterial} />

      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.65, -1.55, Math.sin(rad) * 0.65]} material={valveMaterial}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
          </mesh>
        );
      })}

      <mesh>
        <torusGeometry args={[0.752, 0.006, 4, 64]} />
        <meshStandardMaterial color="#8899AA" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
}
