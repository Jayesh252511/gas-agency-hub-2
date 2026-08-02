'use client';
import dynamic from 'next/dynamic';

const ScrollExperience = dynamic(
  () => import('@/components/ScrollExperience'),
  { ssr: false }
);

export default function HomePage() {
  return <ScrollExperience />;
}
