import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

// Inter is a clean, modern font that works beautifully
// for both UI text and longer reading content
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Second Brain — AI Knowledge System',
  description:
    'Capture, organize, and intelligently surface ' +
    'knowledge with Claude AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={
          inter.className +
          ' bg-[#0a0a0a] text-white min-h-screen antialiased'
        }
      >
        {/* Navbar is fixed and sits above all page content */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}