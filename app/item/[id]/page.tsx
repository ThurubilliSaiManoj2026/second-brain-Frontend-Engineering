'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  ExternalLink,
  Clock,
  Tag,
  Sparkles,
  Tags,
  Loader2,
  FileText,
  Link2,
  Lightbulb,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { KnowledgeItem } from '@/lib/types';

export default function ItemDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [item,        setItem]        = useState<KnowledgeItem | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [tagging,     setTagging]     = useState(false);

  useEffect(() => {
    fetch(`/api/knowledge/${id}`)
      .then((r) => r.json())
      .then(({ data }) => setItem(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSummarize = async () => {
    if (!item) return;
    setSummarizing(true);
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        title: item.title,
        content: item.content,
      }),
    });
    const { summary } = await res.json();
    setItem((p) => (p ? { ...p, summary } : null));
    setSummarizing(false);
  };

  const handleAutoTag = async () => {
    if (!item) return;
    setTagging(true);
    const res = await fetch('/api/ai/autotag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        title: item.title,
        content: item.content,
      }),
    });
    const { tags } = await res.json();
    setItem((p) => (p ? { ...p, ai_tags: tags } : null));
    setTagging(false);
  };

  const handleDelete = async () => {
    if (!item || !confirm('Permanently delete this item?')) return;
    await fetch(`/api/knowledge/${item.id}`, { method: 'DELETE' });
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div
        className={
          'min-h-screen bg-[#0a0a0a] pt-20 ' +
          'flex items-center justify-center'
        }
      >
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className={
          'min-h-screen bg-[#0a0a0a] pt-20 ' +
          'flex flex-col items-center justify-center gap-4'
        }
      >
        <p className="text-zinc-500">Item not found</p>
        <Link
          href="/dashboard"
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const typeIcon = {
    note:    <FileText  className="w-5 h-5" />,
    link:    <Link2     className="w-5 h-5" />,
    insight: <Lightbulb className="w-5 h-5" />,
  };

  const typeColor = {
    note:    'text-blue-400 bg-blue-500/10',
    link:    'text-emerald-400 bg-emerald-500/10',
    insight: 'text-violet-400 bg-violet-500/10',
  };

  const userTags  = item.tags    || [];
  const aiTags    = item.ai_tags || [];
  const totalTags = userTags.length + aiTags.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        <Link
          href="/dashboard"
          className={
            'inline-flex items-center gap-2 ' +
            'text-zinc-600 hover:text-white ' +
            'text-sm transition-colors mb-8'
          }
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* ── Top row: type badge + delete ── */}
          <div className="flex items-start justify-between mb-6">
            <span
              className={
                'inline-flex items-center gap-2 ' +
                'px-3 py-1.5 rounded-lg text-sm font-medium ' +
                typeColor[item.type]
              }
            >
              {typeIcon[item.type]}
              {item.type}
            </span>
            <button
              onClick={handleDelete}
              className={
                'p-2 rounded-lg border border-zinc-800 ' +
                'hover:border-red-500/40 hover:bg-red-500/10 ' +
                'text-zinc-600 hover:text-red-400 transition-colors'
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* ── Title ── */}
          <h1
            className={
              'text-3xl font-bold text-white mb-4 leading-snug'
            }
          >
            {item.title}
          </h1>

          {/* ── Meta row ── */}
          <div
            className={
              'flex items-center gap-5 ' +
              'text-sm text-zinc-600 mb-8'
            }
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(
                new Date(item.created_at),
                { addSuffix: true }
              )}
            </span>
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  'flex items-center gap-1.5 ' +
                  'text-indigo-500 hover:text-indigo-300 ' +
                  'transition-colors'
                }
              >
                <ExternalLink className="w-4 h-4" />
                Source
              </a>
            )}
          </div>

          {/* ── AI Summary ── */}
          {item.summary && (
            <div
              className={
                'p-5 rounded-xl mb-8 ' +
                'bg-indigo-950/30 border border-indigo-500/20'
              }
            >
              <p
                className={
                  'text-xs text-indigo-400 ' +
                  'uppercase tracking-wider mb-2 ' +
                  'flex items-center gap-1.5'
                }
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Summary
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {item.summary}
              </p>
            </div>
          )}

          {/* ── Main content ── */}
          <div
            className={
              'text-zinc-300 leading-relaxed ' +
              'whitespace-pre-wrap mb-8 text-[15px]'
            }
          >
            {item.content}
          </div>

          {/* ── Tags ── */}
          {totalTags > 0 && (
            <div className="mb-8">
              <p
                className={
                  'text-sm text-zinc-600 mb-3 ' +
                  'flex items-center gap-1.5'
                }
              >
                <Tag className="w-4 h-4" />
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {userTags.map((t) => (
                  <span
                    key={t}
                    className={
                      'px-3 py-1 rounded-full ' +
                      'bg-zinc-800 text-zinc-300 text-sm'
                    }
                  >
                    #{t}
                  </span>
                ))}
                {aiTags.map((t) => (
                  <span
                    key={t}
                    className={
                      'px-3 py-1 rounded-full ' +
                      'bg-indigo-900/30 border border-indigo-500/20 ' +
                      'text-indigo-400 text-sm'
                    }
                  >
                    #{t}{' '}
                    <span className="opacity-50 text-xs">AI</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Action Buttons ── */}
          <div
            className={
              'flex gap-3 pt-6 border-t border-zinc-800/60'
            }
          >
            {!item.summary && (
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className={
                  'flex items-center gap-2 px-4 py-2.5 ' +
                  'rounded-lg text-sm font-medium transition-colors ' +
                  'border border-indigo-500/40 bg-indigo-500/10 ' +
                  'text-indigo-400 hover:bg-indigo-500/20 ' +
                  'disabled:opacity-50'
                }
              >
                {summarizing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Sparkles className="w-4 h-4" />
                }
                Generate AI Summary
              </button>
            )}
            <button
              onClick={handleAutoTag}
              disabled={tagging}
              className={
                'flex items-center gap-2 px-4 py-2.5 ' +
                'rounded-lg text-sm font-medium transition-colors ' +
                'border border-violet-500/40 bg-violet-500/10 ' +
                'text-violet-400 hover:bg-violet-500/20 ' +
                'disabled:opacity-50'
              }
            >
              {tagging
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Tags className="w-4 h-4" />
              }
              AI Auto-Tag
            </button>
          </div>

        </motion.article>
      </div>
    </div>
  );
}