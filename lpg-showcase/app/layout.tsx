import type { Metadata, Viewport } from 'next';
import { VT323, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAFA',
};

export const metadata: Metadata = {
  title: 'GasAgency Hub — The Future of LPG Agency Management',
  description:
    'A complete operating system for modern LPG gas agencies in India. Manage sales, stock, udhari, delivery and payments from one intelligent platform.',
  keywords: ['LPG agency ERP', 'gas agency software', 'cylinder management', 'India'],
  openGraph: {
    title: 'GasAgency Hub — The Future of LPG Agency Management',
    description: 'Complete operating system for modern LPG gas agencies in India.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body style={{ margin: 0, background: '#FAFAFA', cursor: 'none' }}>
        {children}
      </body>
    </html>
  );
}
