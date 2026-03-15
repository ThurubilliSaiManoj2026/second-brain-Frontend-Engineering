'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Trash2,
  ExternalLink,
  Tag,
  Clock,
  FileText,
  Link2,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { KnowledgeItem } from '@/lib/types';

interface Props {
  item: KnowledgeItem;
  onDelete: (id: string) => void;
}

// Each type gets its own color so users can identify content at a glance
const typeConfig = {
  note: {
    icon: <FileText className="w-3.5 h-3.5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  link: {
    icon: <Link2 className="w-3.5 h-3.5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  insight: {
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
};

export default function KnowledgeCard({ item, onDelete }: Props) {
  const cfg = typeConfig[item.type];
  const allTags = [
    ...(item.tags || []),
    ...(item.ai_tags || []),
  ];

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Remove this item from your brain?')) {
      onDelete(item.id);
    }
  };

  // Type badge class built from short strings
  const badgeClass =
    'inline-flex items-center gap-1.5 ' +
    'px-2.5 py-1 rounded-md ' +
    'text-xs font-medium ' +
    cfg.bg + ' ' +
    cfg.color + ' ' +
    'border ' +
    cfg.border;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={
        'group relative bg-[#111111] ' +
        'border border-zinc-800 ' +
        'hover:border-zinc-600 ' +
        'rounded-2xl p-5 ' +
        'transition-all duration-200 ' +
        'overflow-hidden'
      }
    >
      {/* Subtle gradient that appears on hover */}
      <div
        className={
          'absolute inset-0 opacity-0 ' +
          'group-hover:opacity-100 ' +
          'transition-opacity duration-300 ' +
          'bg-gradient-to-br ' +
          'from-indigo-600/5 to-transparent ' +
          'rounded-2xl pointer-events-none'
        }
      />

      <div className="relative">

        {/* ── Type badge + action buttons ── */}
        <div className="flex items-start justify-between mb-3">
          <span className={badgeClass}>
            {cfg.icon}
            {item.type}
          </span>

          {/* Action buttons — visible only on hover */}
          <div
            className={
              'flex items-center gap-1 ' +
              'opacity-0 group-hover:opacity-100 ' +
              'transition-opacity'
            }
          >
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={
                  'p-1.5 rounded-lg ' +
                  'hover:bg-zinc-700 ' +
                  'text-zinc-500 hover:text-zinc-200 ' +
                  'transition-colors'
                }
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={handleDelete}
              className={
                'p-1.5 rounded-lg ' +
                'hover:bg-red-500/20 ' +
                'text-zinc-500 hover:text-red-400 ' +
                'transition-colors'
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Title ── */}
        <Link href={`/item/${item.id}`}>
          <h3
            className={
              'font-semibold text-white ' +
              'hover:text-indigo-300 ' +
              'transition-colors mb-2 ' +
              'line-clamp-2 ' +
              'text-[15px] leading-snug'
            }
          >
            {item.title}
          </h3>
        </Link>

        {/* Show AI summary if available, else raw content */}
        <p
          className={
            'text-sm text-zinc-500 ' +
            'line-clamp-3 leading-relaxed mb-4'
          }
        >
          {item.summary || item.content}
        </p>

        {/* ── Tags ── */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {allTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={
                  'inline-flex items-center gap-1 ' +
                  'px-2 py-0.5 rounded-md ' +
                  'bg-zinc-800/80 text-zinc-500 text-xs'
                }
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {allTags.length > 4 && (
              <span
                className={
                  'px-2 py-0.5 rounded-md ' +
                  'bg-zinc-800 text-zinc-600 text-xs'
                }
              >
                +{allTags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Clock className="w-3 h-3" />
          <span>
            {formatDistanceToNow(
              new Date(item.created_at),
              { addSuffix: true }
            )}
          </span>
          {item.summary && (
            <>
              <span className="text-zinc-800">·</span>
              <span
                className={
                  'flex items-center gap-1 text-indigo-600'
                }
              >
                <Sparkles className="w-3 h-3" />
                AI Summary
              </span>
            </>
          )}
        </div>

      </div>
    </motion.div>
  );
}