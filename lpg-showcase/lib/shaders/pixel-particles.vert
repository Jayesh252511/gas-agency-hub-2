// Vertex Shader — GPU Instanced Pixel Particles
// Each instance is a tiny square billboard

varying vec2 vUv;
varying float vLifetime;
varying float vOpacity;

uniform float u_time;
uniform float u_progress; // 0 = dispersed, 1 = assembled at target
uniform float u_pixelSize;

attribute vec3 a_target;   // target position (assembled)
attribute vec3 a_origin;   // start position (dispersed cloud)
attribute float a_speed;
attribute float a_phase;
attribute float a_size;

void main() {
  vUv = uv;

  // Interpolate from cloud → target based on u_progress
  float eased = u_progress * u_progress * (3.0 - 2.0 * u_progress); // smoothstep
  vec3 pos = mix(a_origin, a_target, eased);

  // Tiny orbit around assembled position when fully built
  float orbit = (1.0 - eased) * 0.0 + eased * 0.0;
  pos.x += sin(u_time * a_speed + a_phase) * orbit * 0.05;
  pos.y += cos(u_time * a_speed + a_phase * 1.3) * orbit * 0.03;

  vOpacity = mix(0.3, 1.0, eased) * (0.6 + 0.4 * sin(u_time * 0.8 + a_phase));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Square pixel size — bigger when dispersed, smaller when assembled
  float sizeFactor = mix(a_size * 2.5, a_size, eased);
  gl_PointSize = sizeFactor * (300.0 / -mvPosition.z);
}
