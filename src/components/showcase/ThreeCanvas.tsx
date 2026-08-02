import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/showcase-scroll-store';

const PARTICLE_COUNT = 2000;

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

const particleVert = /* glsl */`
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

const particleFrag = /* glsl */`
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

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAFAFA');

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 5.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight('#FFF8F0', 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#FFFFFF', 1.4);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight('#FF6A00', 0.8, 8);
    pointLight1.position.set(-3, -1, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#F0F0F0', 0.4, 10);
    pointLight2.position.set(4, 2, -2);
    scene.add(pointLight2);

    // 5. Cylinder Model Group
    const cylGroup = new THREE.Group();
    cylGroup.position.set(0, -0.5, 0);
    cylGroup.scale.set(0, 0, 0);
    scene.add(cylGroup);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B8C4CC'),
      metalness: 0.88,
      roughness: 0.22,
    });
    const bodyGeo = new THREE.LatheGeometry(getCylinderPoints(), 64);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    cylGroup.add(bodyMesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF6A00'), wireframe: true, transparent: true, opacity: 1 });
    const wireMesh = new THREE.Mesh(bodyGeo, wireMat);
    wireMesh.scale.set(1.002, 1.002, 1.002);
    cylGroup.add(wireMesh);

    const stripeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#FF6A00'), metalness: 0.5, roughness: 0.35, emissive: new THREE.Color('#FF6A00'), emissiveIntensity: 0 });
    const stripeGeo = new THREE.CylinderGeometry(0.758, 0.758, 0.18, 64, 1, true);
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.set(0, 0.1, 0);
    cylGroup.add(stripeMesh);

    const valveGroup = new THREE.Group();
    valveGroup.position.set(0, 1.68, 0);
    cylGroup.add(valveGroup);

    const valveMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2A2A2A'), metalness: 0.9, roughness: 0.15 });
    const stemGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.20, 16);
    valveGroup.add(new THREE.Mesh(stemGeo, valveMat));

    const wheelGeo = new THREE.TorusGeometry(0.20, 0.035, 8, 32);
    const wheelMesh = new THREE.Mesh(wheelGeo, valveMat);
    wheelMesh.position.set(0, 0.14, 0);
    wheelMesh.rotation.x = Math.PI / 2;
    valveGroup.add(wheelMesh);

    // Indicator LED
    const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const ledMat = new THREE.MeshStandardMaterial({ color: '#FF6A00', emissive: '#FF6A00', emissiveIntensity: 1.2 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.12, 0.05, 0);
    valveGroup.add(ledMesh);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.28, 0.038, 8, 24, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: '#888899', metalness: 0.7, roughness: 0.4 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0, 1.25, 0);
    handleMesh.rotation.x = Math.PI / 2;
    handleMesh.rotation.z = Math.PI / 2;
    cylGroup.add(handleMesh);

    // 6. Particle System
    const particleOrigins = new Float32Array(PARTICLE_COUNT * 3);
    const particleTargets = new Float32Array(PARTICLE_COUNT * 3);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particlePhases = new Float32Array(PARTICLE_COUNT);
    const particleSizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2.0;
      particleOrigins[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particleOrigins[i * 3 + 1] = r * Math.cos(phi);
      particleOrigins[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = i / PARTICLE_COUNT;
      const tTheta = Math.random() * Math.PI * 2;
      const y = -1.6 + t * 3.3 + (Math.random() - 0.5) * 0.1;
      const tr = y < -1.5 ? 0.72 : y < 0.8 ? 0.75 : y < 1.2 ? 0.65 - (y - 0.8) * 0.5 : y < 1.4 ? 0.35 : 0.20;
      particleTargets[i * 3] = tr * Math.cos(tTheta);
      particleTargets[i * 3 + 1] = y;
      particleTargets[i * 3 + 2] = tr * Math.sin(tTheta);

      particleSpeeds[i] = 0.4 + Math.random() * 1.2;
      particlePhases[i] = Math.random() * Math.PI * 2;
      particleSizes[i] = 2.0 + Math.random() * 4.0;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(particleTargets, 3));
    pGeo.setAttribute('a_origin', new THREE.BufferAttribute(particleOrigins, 3));
    pGeo.setAttribute('a_speed', new THREE.BufferAttribute(particleSpeeds, 1));
    pGeo.setAttribute('a_phase', new THREE.BufferAttribute(particlePhases, 1));
    pGeo.setAttribute('a_size', new THREE.BufferAttribute(particleSizes, 1));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_color: { value: new THREE.Color('#FF6A00') },
      },
      transparent: true,
      depthWrite: false,
    });
    const pointsMesh = new THREE.Points(pGeo, pMat);
    scene.add(pointsMesh);

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const state = useScrollStore.getState();
      const { cylinder, activeScene } = state;

      // Update particles
      pMat.uniforms.u_time.value = elapsed;
      pMat.uniforms.u_progress.value += (cylinder.particleProgress - pMat.uniforms.u_progress.value) * 0.06;

      const targetColor = activeScene === 8
        ? new THREE.Color('#FF6A00')
        : cylinder.particleProgress > 0.8
          ? new THREE.Color('#FFFFFF')
          : new THREE.Color('#FF6A00');
      pMat.uniforms.u_color.value.lerp(targetColor, 0.05);

      // Update cylinder group
      const targetScale = cylinder.scale;
      cylGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      cylGroup.position.y += (cylinder.posY - cylGroup.position.y) * 0.06;
      cylGroup.rotation.y += (cylinder.rotationY - cylGroup.rotation.y) * 0.04;
      cylGroup.position.y += Math.sin(elapsed * 0.6) * 0.015;

      valveGroup.rotation.y += (cylinder.valveRotation - valveGroup.rotation.y) * 0.05;
      wireMat.opacity = cylinder.wireframeOpacity;
      stripeMat.emissiveIntensity += (cylinder.emissiveIntensity - stripeMat.emissiveIntensity) * 0.05;

      // Camera position from scroll store
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

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
