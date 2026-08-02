// Fragment Shader — GPU Instanced Pixel Particles
// Hard-edged squares — NOT soft circles

varying float vOpacity;

uniform vec3 u_color;   // #FF6A00 orange or white

void main() {
  // Hard square clipping using point coord — makes it a pixel, not a dot
  vec2 coord = gl_PointCoord - 0.5;
  
  // Discard outside a tight square (not circle)
  if (abs(coord.x) > 0.48 || abs(coord.y) > 0.48) discard;

  // Tiny inner border for "pixel" look
  float border = 0.42;
  float alpha = (abs(coord.x) < border && abs(coord.y) < border) ? 1.0 : 0.4;

  gl_FragColor = vec4(u_color, vOpacity * alpha);
}
