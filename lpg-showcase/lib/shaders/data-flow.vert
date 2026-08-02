// Data Flow Vertex Shader
// Animates point positions along tube path segments

uniform float u_time;
uniform float u_progress; // 0=invisible, 1=fully flowing
varying float vOpacity;
varying vec3 vColor;

attribute float a_offset;   // 0–1 position along path
attribute vec3 a_color;
attribute float a_speed;

void main() {
  vColor = a_color;

  // Trail offset — wrapping flow
  float flow = fract(a_offset - u_time * a_speed * 0.12);
  
  // Fade edges of trail
  float trailAlpha = sin(flow * 3.14159);
  vOpacity = trailAlpha * u_progress * 0.9;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 3.5 * (200.0 / -mvPosition.z);
}
