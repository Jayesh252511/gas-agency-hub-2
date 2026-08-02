import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/showcase-scroll-store';

const PARTICLE_COUNT = 2000;

function makeCloudPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.5 + Math.random() * 2.0;
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi);
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
}

function makeCylinderTargets(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const theta = Math.random() * Math.PI * 2;
    const y = -1.6 + t * 3.3 + (Math.random() - 0.5) * 0.1;
    const r = y < -1.5 ? 0.72 :
              y < 0.8  ? 0.75 :
              y < 1.2  ? 0.65 - (y - 0.8) * 0.5 :
              y < 1.4  ? 0.35 :
                         0.20;
    arr[i * 3]     = r * Math.cos(theta) + (Math.random() - 0.5) * 0.04;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = r * Math.sin(theta) + (Math.random() - 0.5) * 0.04;
  }
  return arr;
}

function makeAttributes(count: number) {
  const speeds  = new Float32Array(count);
  const phases  = new Float32Array(count);
  const sizes   = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    speeds[i] = 0.4 + Math.random() * 1.2;
    phases[i] = Math.random() * Math.PI * 2;
    sizes[i]  = 2.0 + Math.random() * 4.0;
  }
  return { speeds, phases, sizes };
}

const vertexShader = /* glsl */`
  attribute vec3 a_origin;
  attribute float a_speed;
  attribute float a_phase;
  attribute float a_size;

  uniform float u_time;
  uniform float u_progress;

  varying float vOpacity;

  void main() {
    float eased = u_progress * u_progress * (3.0 - 2.0 * u_progress);
    vec3 pos = mix(a_origin, position, eased);
    pos.x += sin(u_time * a_speed + a_phase) * (1.0 - eased) * 0.08;
    pos.y += cos(u_time * a_speed * 0.7 + a_phase) * (1.0 - eased) * 0.06;

    vOpacity = mix(0.35, 0.95, eased) * (0.5 + 0.5 * sin(u_time * 0.9 + a_phase));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float sizeFactor = mix(a_size * 2.8, a_size, eased);
    gl_PointSize = sizeFactor * (280.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3 u_color;
  varying float vOpacity;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (abs(c.x) > 0.48 || abs(c.y) > 0.48) discard;
    float border = step(0.42, max(abs(c.x), abs(c.y)));
    float alpha = mix(1.0, 0.35, border);
    gl_FragColor = vec4(u_color, vOpacity * alpha);
  }
`;

export default function PixelParticles() {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { origins, targets, speeds, phases, sizes } = useMemo(() => {
    const origins = makeCloudPositions(PARTICLE_COUNT);
    const targets = makeCylinderTargets(PARTICLE_COUNT);
    const { speeds, phases, sizes } = makeAttributes(PARTICLE_COUNT);
    return { origins, targets, speeds, phases, sizes };
  }, []);

  const uniforms = useMemo(() => ({
    u_time:     { value: 0 },
    u_progress: { value: 0 },
    u_color:    { value: new THREE.Color('#FF6A00') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const { cylinder, activeScene } = useScrollStore.getState();
    matRef.current.uniforms.u_time.value = clock.getElapsedTime();
    matRef.current.uniforms.u_progress.value += (cylinder.particleProgress - matRef.current.uniforms.u_progress.value) * 0.06;

    const targetColor = activeScene === 8
      ? new THREE.Color('#FF6A00')
      : cylinder.particleProgress > 0.8
        ? new THREE.Color('#FFFFFF')
        : new THREE.Color('#FF6A00');
    matRef.current.uniforms.u_color.value.lerp(targetColor, 0.05);

    matRef.current.transparent = true;
    matRef.current.depthWrite = false;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[targets, 3]} />
        <bufferAttribute attach="attributes-a_origin"  args={[origins, 3]} />
        <bufferAttribute attach="attributes-a_speed"   args={[speeds, 1]} />
        <bufferAttribute attach="attributes-a_phase"   args={[phases, 1]} />
        <bufferAttribute attach="attributes-a_size"    args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
