import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pixel Art Dream Generator',
  description: 'Transform your ideas into surreal, Lynch-inspired pixel art scenes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}