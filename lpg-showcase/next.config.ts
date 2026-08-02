import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow Three.js, Drei, and R3F to be transpiled (fixes ESM issues)
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],

  // Turbopack rule for GLSL shader files
  turbopack: {
    rules: {
      '*.{glsl,vert,frag}': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
