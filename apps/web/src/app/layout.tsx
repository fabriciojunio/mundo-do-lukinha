import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mundo do Lukinha — Aprenda Brincando!',
  description:
    'Plataforma educativa com 48 jogos divertidos para crianças de 3 a 14 anos. Matemática, português, ciências, programação e muito mais!',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lukinha',
  },
  applicationName: 'Mundo do Lukinha',
  keywords: ['educação', 'jogos', 'crianças', 'aprendizado', 'matemática', 'programação'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4ECDC4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-light font-body antialiased">{children}</body>
    </html>
  );
}
