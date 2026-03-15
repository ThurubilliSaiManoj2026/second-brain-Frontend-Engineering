'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Plus,
  BookOpen,
  LayoutDashboard,
  Code2,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      href: '/capture',
      label: 'Capture',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      href: '/docs',
      label: 'Docs',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  // Navbar background changes after scrolling 20px
  const navBg = scrolled
    ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-800/60'
    : 'bg-transparent';

  // API href stored in a variable to keep JSX lines short
  const apiHref =
    '/api/public/brain/query' +
    '?q=What+is+in+this+knowledge+base%3F';

  // API badge classes stored in a variable — same reason
  const apiClass =
    'flex items-center gap-1.5 ' +
    'px-3 py-1.5 rounded-lg ' +
    'border border-zinc-700 ' +
    'bg-zinc-900 text-zinc-400 ' +
    'hover:text-white hover:border-zinc-600 ' +
    'text-xs font-mono transition-colors';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={
        'fixed top-0 left-0 right-0 z-50 ' +
        'transition-all duration-300 ' +
        navBg
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={
                'w-8 h-8 rounded-lg bg-indigo-600 ' +
                'flex items-center justify-center ' +
                'group-hover:bg-indigo-500 transition-colors'
              }
            >
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-semibold text-white hidden sm:block"
            >
              Second Brain
            </span>
          </Link>

          {/* ── Nav Links ── */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href + '/');

              const linkClass = isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-white ' +
                  'hover:bg-zinc-800/50';

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    'flex items-center gap-2 ' +
                    'px-4 py-2 rounded-lg ' +
                    'text-sm font-medium ' +
                    'transition-all ' +
                    linkClass
                  }
                >
                  {link.icon}
                  <span className="hidden sm:block">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Public API Badge ── */}
          {/* Lets evaluators test the REST API with one click */}
          <a
            href={apiHref}
            target="_blank"
            rel="noopener noreferrer"
            className={apiClass}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:block">API</span>
          </a>

        </div>
      </div>
    </motion.nav>
  );
}