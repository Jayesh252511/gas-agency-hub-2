'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore, mapRange } from '@/lib/scroll-store';

// Catmull-Rom path through 3D points around the cylinder
function makeFlowPath(offsetAngle: number, yStart: number, yEnd: number): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = offsetAngle + t * Math.PI * 1.5;
    const r = 1.6 + Math.sin(t * Math.PI) * 0.6;
    const y = yStart + (yEnd - yStart) * t;
    points.push(new THREE.Vector3(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    ));
  }
  return new THREE.CatmullRomCurve3(points);
}

const FLOW_PATHS = [
  { angle: 0,           yStart: 1.5,  yEnd: -1.5, label: 'Booking',  color: '#FF6A00' },
  { angle: Math.PI / 2, yStart: -1.5, yEnd: 1.5,  label: 'Payment',  color: '#FF6A00' },
  { angle: Math.PI,     yStart: 0.8,  yEnd: -0.8,  label: 'Stock',   color: '#888899' },
  { angle: 3*Math.PI/2, yStart: -0.5, yEnd: 1.2,  label: 'Delivery', color: '#888899' },
];

const POINTS_PER_PATH = 200;

// Inline GLSL for data flow
const vertexShader = /* glsl */`
  attribute float a_offset;
  attribute float a_speed;
  attribute vec3 a_color;
  uniform float u_time;
  uniform float u_progress;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    vColor = a_color;
    float flow = fract(a_offset - u_time * a_speed * 0.08);
    float trail = sin(flow * 3.14159);
    vOpacity = trail * u_progress * 0.9;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.0 + trail * 2.0) * (180.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */`
  varying float vOpacity;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (abs(c.x) > 0.48 || abs(c.y) > 0.48) discard;
    gl_FragColor = vec4(vColor, vOpacity);
  }
`;

export default function DataFlow() {
  const matsRef = useRef<THREE.ShaderMaterial[]>([]);

  const { positions, offsets, speeds, colors } = useMemo(() => {
    const allPositions: number[] = [];
    const allOffsets: number[] = [];
    const allSpeeds: number[] = [];
    const allColors: number[] = [];

    FLOW_PATHS.forEach((path) => {
      const curve = makeFlowPath(path.angle, path.yStart, path.yEnd);
      const col = new THREE.Color(path.color);
      for (let i = 0; i < POINTS_PER_PATH; i++) {
        const t = i / POINTS_PER_PATH;
        const pt = curve.getPoint(t);
        allPositions.push(pt.x, pt.y, pt.z);
        allOffsets.push(t);
        allSpeeds.push(0.5 + Math.random() * 0.8);
        allColors.push(col.r, col.g, col.b);
      }
    });

    return {
      positions: new Float32Array(allPositions),
      offsets: new Float32Array(allOffsets),
      speeds: new Float32Array(allSpeeds),
      colors: new Float32Array(allColors),
    };
  }, []);

  const uniforms = useMemo(() => ({
    u_time:     { value: 0 },
    u_progress: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const { dataFlowVisible, scrollProgress } = useScrollStore.getState();
    const targetP = dataFlowVisible ? mapRange(scrollProgress, 0.58, 0.64, 0, 1) : 0;

    matsRef.current.forEach((mat) => {
      if (!mat) return;
      mat.uniforms.u_time.value = clock.getElapsedTime();
      mat.uniforms.u_progress.value += (targetP - mat.uniforms.u_progress.value) * 0.05;
    });
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-a_offset" args={[offsets, 1]} />
        <bufferAttribute attach="attributes-a_speed"  args={[speeds, 1]} />
        <bufferAttribute attach="attributes-a_color"  args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={(el) => { if (el) matsRef.current[0] = el; }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
