varying float vOpacity;
varying vec3 vColor;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  if (abs(coord.x) > 0.48 || abs(coord.y) > 0.48) discard;
  gl_FragColor = vec4(vColor, vOpacity);
}
