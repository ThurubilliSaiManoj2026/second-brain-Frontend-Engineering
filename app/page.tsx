'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Search,
  Globe,
  ArrowRight,
  Zap,
  Database,
  Code2,
  ChevronDown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// Defined outside the component so they are created once
// in memory and never recreated on re-renders.
// ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// staggerContainer delays each child by 0.08s relative to
// the previous one — creating the sequential wave effect
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ─────────────────────────────────────────────────────────
// STATIC DATA — outside component to avoid recreation
// ─────────────────────────────────────────────────────────

const features = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Capture Knowledge',
    desc: 'Store notes, links, and insights with metadata, tags, and source URLs in a clean searchable database.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'AI Summarization',
    desc: 'Generate concise summaries instantly using Claude AI so your dashboard always shows the essence.',
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Auto-Tagging',
    desc: 'Let AI analyze your content and suggest intelligent tags, making your knowledge base self-organizing.',
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Ask Your Brain',
    desc: 'Query your entire knowledge base conversationally. Claude synthesizes answers with cited sources.',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Persistent Storage',
    desc: 'PostgreSQL on Supabase ensures your knowledge is safe, fast, and ready to scale to thousands of items.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Public REST API',
    desc: 'Expose your brain intelligence via a public endpoint queryable by any tool or external system.',
  },
];

const stats = [
  { v: 'REST', l: 'Public API' },
  { v: 'AI', l: 'Summarization' },
  { v: '3', l: 'AI Features' },
];

const stack = [
  'Next.js 14',
  'React 18',
  'Tailwind CSS',
  'Supabase',
  'Claude AI',
  'Framer Motion',
  'TypeScript',
];

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────

export default function LandingPage() {
  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    // FIX 1: overflow-hidden removed from the root div.
    // overflow-hidden was clipping the absolute glow blobs at
    // section boundaries, causing a hard visible edge during scroll.
    // overflow-x-hidden on body in globals.css handles horizontal
    // overflow without clipping vertical content.
    <div className="bg-[#0a0a0a] text-white">

      {/* ════════════════════════════════════════════════
          HERO SECTION
          FIX 2: overflow-hidden removed from this section.
          The glow blobs need to bleed past section edges to
          look natural. overflow-hidden was cutting them off,
          creating the "box cut off" appearance you reported.

          FIX 3: Using isolate to create a new stacking context.
          This tells the browser compositor to paint this section
          on its own layer — preventing subpixel bleed between
          sections that was causing the white line flicker.
      ════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen pt-16 flex flex-col items-center justify-center isolate"
      >
        {/* Pure CSS grid — zero JS, handled by GPU natively */}
        <div
          className="absolute inset-0 -z-10 opacity-20 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />

        {/* Glow blobs — -z-10 puts them behind content but
            without overflow-hidden they can bleed naturally */}
        <div
          className="absolute -z-10 top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-700/20 rounded-full blur-[160px] pointer-events-none"
        />
        <div
          className="absolute -z-10 bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-700/15 rounded-full blur-[130px] pointer-events-none"
        />

        {/* Hero content — animates once on mount, never on scroll */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full"
        >
          {/* Pill badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Claude AI · Built on Next.js 14
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Second Brain
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Infrastructure for thought. Capture ideas, surface insights,
            and let AI make sense of everything you have ever learned.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              Open Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/capture"
              className="flex items-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-400 hover:text-white rounded-xl font-semibold transition-all duration-200"
            >
              Capture a Note
            </Link>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-16"
          >
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-zinc-600 mt-1.5 uppercase tracking-[0.15em]">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* FIX 4: Scroll indicator repositioned.
            Instead of absolute positioning (which fights with the
            flex layout), we use a margin-top: auto trick inside the
            flex column. The wrapper div pushes itself to the bottom
            of the flex container naturally, so it always sits at
            the very bottom of the viewport regardless of content height. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={handleScrollDown}
          className="mt-auto pb-10 flex flex-col items-center gap-1.5 text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES SECTION
          Each card uses whileInView so it only animates
          when it enters the viewport — never all at once.
          viewport once:true means each animation runs
          exactly once, keeping the page feeling intentional.
      ════════════════════════════════════════════════ */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Everything your mind needs
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              A complete system that grows smarter the more you use it.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={cardVariant}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-[#111111] border border-zinc-800/80 hover:border-indigo-500/40 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl mb-4 bg-indigo-600/20 border border-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/30 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STACK SECTION
          FIX 5: Replaced border-y (which caused the white
          line flicker at scroll boundaries) with box-shadow.
          box-shadow is composited on its own GPU layer and
          never causes subpixel repaints during scroll.
      ════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="py-20 px-4"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(39,39,42,0.6), inset 0 -1px 0 rgba(39,39,42,0.6)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-700 text-xs uppercase tracking-[0.25em] mb-8">
            Built with
          </p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {stack.map((t) => (
              <motion.span
                key={t}
                variants={cardVariant}
                className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-600 hover:text-zinc-200 transition-colors duration-200"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════
          FINAL CTA SECTION
      ════════════════════════════════════════════════ */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-12 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-violet-900/20 border border-indigo-500/20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="inline-block mb-5"
            >
              <Zap className="w-10 h-10 text-indigo-400" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to build your Second Brain?
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Start capturing knowledge today. Your notes, links, and insights
              organized, summarized, and queryable through a single
              intelligent system.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors duration-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}