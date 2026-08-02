'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore, mapRange } from '@/lib/scroll-store';

// Lathe points for a classic LPG cylinder silhouette
function getCylinderPoints(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.00, -1.60),  // base center
    new THREE.Vector2(0.72, -1.60),  // base edge
    new THREE.Vector2(0.74, -1.50),  // base curve
    new THREE.Vector2(0.75, -1.20),  // body
    new THREE.Vector2(0.75,  0.80),  // body top
    new THREE.Vector2(0.73,  0.95),  // shoulder start
    new THREE.Vector2(0.60,  1.20),  // shoulder
    new THREE.Vector2(0.40,  1.35),  // neck base
    new THREE.Vector2(0.28,  1.42),  // neck
    new THREE.Vector2(0.28,  1.65),  // valve base
    new THREE.Vector2(0.22,  1.70),  // valve taper
    new THREE.Vector2(0.18,  1.72),  // valve top
    new THREE.Vector2(0.00,  1.72),  // center top
  ];
}

export default function CylinderModel() {
  const groupRef = useRef<THREE.Group>(null);
  const valveRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null);
  const { camera } = useThree();

  // PBR body material — industrial brushed steel with orange accent zone
  const bodyMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B8C4CC'),
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.2,
    });
    return mat;
  }, []);

  // Orange stripe material
  const stripeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FF6A00'),
    metalness: 0.5,
    roughness: 0.35,
    emissive: new THREE.Color('#FF6A00'),
    emissiveIntensity: 0,
  }), []);

  // Wireframe material
  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FF6A00'),
    wireframe: true,
    transparent: true,
    opacity: 1,
  }), []);

  // Dark valve material
  const valveMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2A2A2A'),
    metalness: 0.9,
    roughness: 0.15,
  }), []);

  // Handle material
  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#888899'),
    metalness: 0.7,
    roughness: 0.4,
  }), []);

  // Cylinder geometry from lathe profile
  const bodyGeometry = useMemo(() => {
    return new THREE.LatheGeometry(getCylinderPoints(), 64);
  }, []);

  // Orange stripe ring around body
  const stripeGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.758, 0.758, 0.18, 64, 1, true);
  }, []);

  // Valve wheel
  const valveWheelGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.20, 0.035, 8, 32);
  }, []);

  // Handle arch
  const handleGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.28, 0.038, 8, 24, Math.PI);
  }, []);

  // Base ring
  const baseRingGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.68, 0.05, 8, 48);
  }, []);

  useFrame(({ clock }) => {
    const state = useScrollStore.getState();
    const { cylinder } = state;
    const t = clock.getElapsedTime();

    if (!groupRef.current) return;

    // Smooth scale
    const targetScale = cylinder.scale;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    // Smooth Y position
    groupRef.current.position.y += (cylinder.posY - groupRef.current.position.y) * 0.06;

    // Slow auto rotation + scroll-driven rotation
    groupRef.current.rotation.y += (cylinder.rotationY - groupRef.current.rotation.y) * 0.04;

    // Gentle breathing float
    const breath = Math.sin(t * 0.6) * 0.015;
    groupRef.current.position.y += breath;

    // Valve rotation
    if (valveRef.current) {
      valveRef.current.rotation.y += (cylinder.valveRotation - valveRef.current.rotation.y) * 0.05;
    }

    // Wireframe fade out as cylinder assembles
    if (wireRef.current) {
      (wireRef.current.material as THREE.MeshBasicMaterial).opacity = cylinder.wireframeOpacity;
    }

    // Emissive glow on stripe + valve
    if (emissiveRef.current) {
      emissiveRef.current.emissiveIntensity += (cylinder.emissiveIntensity - emissiveRef.current.emissiveIntensity) * 0.05;
    }

    // Camera orbit driven by scroll state
    const { azimuth, elevation, distance, targetX, targetY, targetZ } = state.camera;
    const azRad = (azimuth * Math.PI) / 180;
    const elRad = (elevation * Math.PI) / 180;

    const camX = Math.sin(azRad) * Math.cos(elRad) * distance;
    const camY = Math.sin(elRad) * distance;
    const camZ = Math.cos(azRad) * Math.cos(elRad) * distance;

    camera.position.x += (camX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z += (camZ - camera.position.z) * 0.04;
    camera.lookAt(
      targetX + (Math.random() - 0.5) * 0.0005, // micro shake
      targetY,
      targetZ
    );
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]} position={[0, -0.5, 0]}>
      {/* Main body */}
      <mesh geometry={bodyGeometry} material={bodyMaterial} castShadow receiveShadow />

      {/* Wireframe overlay (fades out as cylinder assembles) */}
      <mesh ref={wireRef} geometry={bodyGeometry} material={wireMaterial} scale={[1.002, 1.002, 1.002]} />

      {/* Orange branding stripe */}
      <mesh geometry={stripeGeometry} position={[0, 0.1, 0]}>
        <primitive object={stripeMaterial} ref={emissiveRef} attach="material" />
      </mesh>

      {/* Second accent stripe */}
      <mesh geometry={stripeGeometry} position={[0, -0.15, 0]} material={stripeMaterial} />

      {/* Base ring */}
      <mesh geometry={baseRingGeometry} position={[0, -1.62, 0]} rotation={[Math.PI / 2, 0, 0]} material={valveMaterial} />

      {/* Valve assembly */}
      <group ref={valveRef} position={[0, 1.68, 0]}>
        {/* Valve stem */}
        <mesh material={valveMaterial}>
          <cylinderGeometry args={[0.07, 0.09, 0.20, 16]} />
        </mesh>
        {/* Valve wheel */}
        <mesh geometry={valveWheelGeometry} material={valveMaterial} position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} />
        {/* Wheel spokes */}
        {[0, 90, 180, 270].map((deg) => (
          <mesh key={deg} material={valveMaterial} rotation={[Math.PI / 2, 0, (deg * Math.PI) / 180]}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
          </mesh>
        ))}
        {/* Orange indicator light on valve */}
        <mesh position={[0.12, 0.05, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#FF6A00"
            emissive="#FF6A00"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Handle arch */}
      <mesh geometry={handleGeometry} position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} material={handleMaterial} />

      {/* Safety cap screws (detail) */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(rad) * 0.65, -1.55, Math.sin(rad) * 0.65]} material={valveMaterial}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
          </mesh>
        );
      })}

      {/* Subtle seam line (decal ring) */}
      <mesh>
        <torusGeometry args={[0.752, 0.006, 4, 64]} />
        <meshStandardMaterial color="#8899AA" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
}
