'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  Tags,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type { KnowledgeType } from '@/lib/types';

export default function CapturePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'note' as KnowledgeType,
    tags: [] as string[],
    source_url: '',
  });
  const [tagInput,       setTagInput]       = useState('');
  const [summaryPreview, setSummaryPreview] = useState('');
  const [aiTagsPreview,  setAiTagsPreview]  = useState<string[]>([]);
  const [summarizing,    setSummarizing]    = useState(false);
  const [tagging,        setTagging]        = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState('');

  // Normalise a raw string into a lowercase hyphenated tag
  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) {
      setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    setForm((p) => ({
      ...p,
      tags: p.tags.filter((t) => t !== tag),
    }));

  const handleSummarize = async () => {
    if (!form.title || !form.content) {
      return setError('Fill in title and content first.');
    }
    setSummarizing(true);
    setError('');
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
        }),
      });
      const { summary } = await res.json();
      setSummaryPreview(summary);
    } catch {
      setError('Summary generation failed.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleAutoTag = async () => {
    if (!form.title || !form.content) {
      return setError('Fill in title and content first.');
    }
    setTagging(true);
    setError('');
    try {
      const res = await fetch('/api/ai/autotag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
        }),
      });
      const { tags } = await res.json();
      setAiTagsPreview(tags);
    } catch {
      setError('Auto-tag generation failed.');
    } finally {
      setTagging(false);
    }
  };

  // Merge AI tags into user tags, deduplicating with Set
  const acceptAiTags = () => {
    setForm((p) => ({
      ...p,
      tags: [...new Set([...p.tags, ...aiTagsPreview])],
    }));
    setAiTagsPreview([]);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return setError('Title and content are required.');
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error: e } = await res.json();
        throw new Error(e || 'Save failed');
      }

      const { data } = await res.json();

      // If a summary was previewed, persist it to the new item
      if (summaryPreview && data?.id) {
        await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.id,
            title: form.title,
            content: form.content,
          }),
        });
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const types: Array<{
    value: KnowledgeType;
    label: string;
    desc: string;
    selected: string;
    idle: string;
  }> = [
    {
      value: 'note',
      label: 'Note',
      desc: 'Thought or idea',
      selected: 'border-blue-500 bg-blue-500/10 text-blue-300',
      idle: 'border-zinc-800 bg-zinc-900 text-zinc-500',
    },
    {
      value: 'link',
      label: 'Link',
      desc: 'Web resource',
      selected: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
      idle: 'border-zinc-800 bg-zinc-900 text-zinc-500',
    },
    {
      value: 'insight',
      label: 'Insight',
      desc: 'Key realization',
      selected: 'border-violet-500 bg-violet-500/10 text-violet-300',
      idle: 'border-zinc-800 bg-zinc-900 text-zinc-500',
    },
  ];

  const inputClass =
    'w-full px-4 py-3 rounded-xl ' +
    'bg-zinc-900 border border-zinc-800 ' +
    'text-white placeholder-zinc-600 ' +
    'focus:outline-none focus:border-indigo-500 ' +
    'transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        <Link
          href="/dashboard"
          className={
            'inline-flex items-center gap-2 ' +
            'text-zinc-600 hover:text-white ' +
            'text-sm transition-colors mb-6'
          }
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Capture Knowledge
          </h1>
          <p className="text-zinc-500 mt-1">
            Add a new item to your second brain
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* ── Type Selector ── */}
          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-3"
            >
              Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() =>
                    setForm((p) => ({ ...p, type: t.value }))
                  }
                  className={
                    'p-4 rounded-xl border-2 text-left ' +
                    'transition-all ' +
                    (form.type === t.value ? t.selected : t.idle)
                  }
                >
                  <div className="font-semibold text-sm">
                    {t.label}
                  </div>
                  <div className="text-xs mt-0.5 opacity-60">
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Title ── */}
          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="A clear, descriptive title..."
              className={inputClass}
            />
          </div>

          {/* ── Content ── */}
          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Content *
            </label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              placeholder="Your note, article text, or insight..."
              rows={6}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* ── AI Action Buttons ── */}
          <div className="flex gap-3">
            <button
              onClick={handleSummarize}
              disabled={summarizing || !form.title || !form.content}
              className={
                'flex-1 flex items-center justify-center gap-2 ' +
                'py-2.5 rounded-xl ' +
                'border border-indigo-500/40 bg-indigo-500/10 ' +
                'text-indigo-400 hover:bg-indigo-500/20 ' +
                'disabled:opacity-40 disabled:cursor-not-allowed ' +
                'text-sm font-medium transition-colors'
              }
            >
              {summarizing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Sparkles className="w-4 h-4" />
              }
              AI Summarize
            </button>
            <button
              onClick={handleAutoTag}
              disabled={tagging || !form.title || !form.content}
              className={
                'flex-1 flex items-center justify-center gap-2 ' +
                'py-2.5 rounded-xl ' +
                'border border-violet-500/40 bg-violet-500/10 ' +
                'text-violet-400 hover:bg-violet-500/20 ' +
                'disabled:opacity-40 disabled:cursor-not-allowed ' +
                'text-sm font-medium transition-colors'
              }
            >
              {tagging
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Tags className="w-4 h-4" />
              }
              AI Auto-Tag
            </button>
          </div>

          {/* ── Summary Preview ── */}
          <AnimatePresence>
            {summaryPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={
                    'p-4 rounded-xl ' +
                    'bg-indigo-950/30 border border-indigo-500/20'
                  }
                >
                  <div
                    className={
                      'flex items-center justify-between mb-2'
                    }
                  >
                    <p
                      className={
                        'text-xs text-indigo-400 ' +
                        'uppercase tracking-wider ' +
                        'flex items-center gap-1.5'
                      }
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Summary Preview
                    </p>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {summaryPreview}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── AI Tags Preview ── */}
          <AnimatePresence>
            {aiTagsPreview.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={
                    'p-4 rounded-xl ' +
                    'bg-violet-950/30 border border-violet-500/20'
                  }
                >
                  <p
                    className={
                      'text-xs text-violet-400 ' +
                      'uppercase tracking-wider mb-2'
                    }
                  >
                    AI Suggested Tags
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {aiTagsPreview.map((tag) => (
                      <span
                        key={tag}
                        className={
                          'px-2 py-1 rounded-md ' +
                          'bg-violet-500/20 text-violet-300 text-xs'
                        }
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={acceptAiTags}
                    className={
                      'text-xs text-violet-400 ' +
                      'hover:text-violet-200 underline transition-colors'
                    }
                  >
                    Accept all tags →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Manual Tags ── */}
          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className={
                    'inline-flex items-center gap-1 ' +
                    'px-2.5 py-1 rounded-md ' +
                    'bg-zinc-800 text-zinc-300 text-sm'
                  }
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className={
                      'text-zinc-500 hover:text-red-400 ' +
                      'transition-colors ml-0.5'
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Type a tag and press Enter..."
                className={
                  'flex-1 px-4 py-2.5 rounded-xl ' +
                  'bg-zinc-900 border border-zinc-800 ' +
                  'text-white placeholder-zinc-600 ' +
                  'focus:outline-none focus:border-zinc-600 ' +
                  'text-sm transition-colors'
                }
              />
              <button
                onClick={() => addTag(tagInput)}
                className={
                  'px-3 rounded-xl bg-zinc-800 ' +
                  'hover:bg-zinc-700 text-zinc-400 transition-colors'
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Source URL ── */}
          <div>
            <label
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Source URL{' '}
              <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              type="url"
              value={form.source_url}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  source_url: e.target.value,
                }))
              }
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <div
              className={
                'px-4 py-3 rounded-xl ' +
                'bg-red-950/30 border border-red-500/30 ' +
                'text-red-400 text-sm'
              }
            >
              {error}
            </div>
          )}

          {/* ── Submit ── */}
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !form.title.trim() ||
              !form.content.trim()
            }
            className={
              'w-full py-4 rounded-xl ' +
              'bg-indigo-600 hover:bg-indigo-500 ' +
              'disabled:opacity-50 disabled:cursor-not-allowed ' +
              'text-white font-semibold transition-colors ' +
              'flex items-center justify-center gap-2'
            }
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add to Brain
              </>
            )}
          </button>

        </motion.div>
      </div>
    </div>
  );
}