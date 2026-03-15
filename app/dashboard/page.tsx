'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Brain,
  MessageSquare,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import KnowledgeCard from '@/components/KnowledgeCard';
import SearchBar from '@/components/SearchBar';
import SkeletonCard from '@/components/SkeletonCard';
import type { KnowledgeItem } from '@/lib/types';

type FilterType = 'all' | 'note' | 'link' | 'insight';
type SortType = 'created_at' | 'updated_at' | 'title';

export default function DashboardPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('created_at');
  const [aiOpen, setAiOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<{
    answer: string;
    sources: Array<{ id: string; title: string; relevance: string }>;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // fetchItems is memoized with useCallback so it only re-creates
  // when its dependencies (search, filterType, sortBy) change.
  // This prevents unnecessary re-renders in the useEffect below.
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search) p.set('search', search);
      if (filterType !== 'all') p.set('type', filterType);
      p.set('sort', sortBy);

      const res = await fetch(`/api/knowledge?${p}`);
      const { data } = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType, sortBy]);

  useEffect(() => {
    // Debounce search by 300ms — avoids hitting the API
    // on every single keystroke while the user is still typing
    const timer = setTimeout(fetchItems, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchItems, search]);

  // Optimistic delete: remove the card from UI immediately,
  // then send the DELETE request. Feels instant to the user.
  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
  };

  const handleAiQuery = async () => {
    if (!question.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      setAiResponse(await res.json());
    } catch {
      setAiResponse({
        answer: 'Something went wrong. Please try again.',
        sources: [],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const typeFilters: Array<{
    value: FilterType;
    label: string;
    active: string;
  }> = [
    { value: 'all',     label: 'All',      active: 'bg-zinc-600 text-white' },
    { value: 'note',    label: 'Notes',    active: 'bg-blue-600 text-white' },
    { value: 'link',    label: 'Links',    active: 'bg-emerald-600 text-white' },
    { value: 'insight', label: 'Insights', active: 'bg-violet-600 text-white' },
  ];

  const suggestions = [
    'What do I know about AI?',
    'Summarize my recent insights',
    'Find notes about productivity',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">
              {loading
                ? 'Loading...'
                : `${items.length} item${items.length !== 1 ? 's' : ''} in your brain`
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAiOpen((p) => !p)}
              className={
                'flex items-center gap-2 px-4 py-2 ' +
                'rounded-lg text-sm font-medium transition-colors ' +
                (aiOpen
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300')
              }
            >
              <Brain className="w-4 h-4" />
              Ask AI
            </button>
            <Link
              href="/capture"
              className={
                'flex items-center gap-2 px-4 py-2 ' +
                'rounded-lg bg-indigo-600 hover:bg-indigo-500 ' +
                'text-white text-sm font-medium transition-colors'
              }
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Link>
          </div>
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={
                  'px-4 py-2.5 rounded-lg text-sm ' +
                  'font-medium transition-all ' +
                  (filterType === f.value
                    ? f.active
                    : 'bg-zinc-800 text-zinc-400 hover:text-white')
                }
              >
                {f.label}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className={
                'px-3 py-2.5 rounded-lg ' +
                'bg-zinc-800 border border-zinc-700 ' +
                'text-zinc-300 text-sm ' +
                'focus:outline-none focus:border-indigo-500'
              }
            >
              <option value="created_at">Newest First</option>
              <option value="updated_at">Recently Updated</option>
              <option value="title">A–Z</option>
            </select>
          </div>
        </div>

        {/* ── Main area: Grid + AI Panel side by side ── */}
        <div className="flex gap-6 items-start">

          {/* Knowledge Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className={
                  'grid grid-cols-1 md:grid-cols-2 ' +
                  'lg:grid-cols-3 gap-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <Brain
                  className="w-14 h-14 text-zinc-800 mx-auto mb-4"
                />
                <h3
                  className={
                    'text-lg font-semibold text-zinc-500 mb-2'
                  }
                >
                  {search || filterType !== 'all'
                    ? 'No matching items found'
                    : 'Your brain is empty'}
                </h3>
                <p className="text-zinc-700 text-sm mb-6">
                  {search
                    ? 'Try different search terms'
                    : 'Add your first knowledge item to get started'}
                </p>
                {!search && filterType === 'all' && (
                  <Link
                    href="/capture"
                    className={
                      'inline-flex items-center gap-2 ' +
                      'px-5 py-2.5 bg-indigo-600 ' +
                      'hover:bg-indigo-500 text-white ' +
                      'rounded-lg text-sm font-medium ' +
                      'transition-colors'
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Add First Item
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  'grid grid-cols-1 md:grid-cols-2 ' +
                  'lg:grid-cols-3 gap-4'
                }
              >
                <AnimatePresence>
                  {items.map((item) => (
                    <KnowledgeCard
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* ── AI Chat Side Panel ── */}
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ opacity: 0, x: 24, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 360 }}
                exit={{ opacity: 0, x: 24, width: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className={
                  'flex-shrink-0 w-[360px] h-[580px] ' +
                  'flex flex-col ' +
                  'bg-[#111111] border border-zinc-800 ' +
                  'rounded-2xl overflow-hidden'
                }
              >
                {/* Panel header */}
                <div
                  className={
                    'flex items-center justify-between ' +
                    'px-4 py-3 border-b border-zinc-800'
                  }
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-white">
                      Ask Your Brain
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAiOpen(false);
                      setAiResponse(null);
                    }}
                    className={
                      'p-1 rounded-lg hover:bg-zinc-800 ' +
                      'text-zinc-500 hover:text-white transition-colors'
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Message area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                  {/* Default state — show suggested prompts */}
                  {!aiResponse && !aiLoading && (
                    <div className="text-center py-8">
                      <MessageSquare
                        className="w-8 h-8 text-zinc-700 mx-auto mb-3"
                      />
                      <p className="text-zinc-600 text-sm mb-4">
                        Ask anything about your knowledge base
                      </p>
                      <div className="space-y-2">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => setQuestion(s)}
                            className={
                              'block w-full text-left ' +
                              'px-3 py-2 rounded-lg ' +
                              'bg-zinc-800/60 hover:bg-zinc-800 ' +
                              'text-zinc-400 hover:text-zinc-300 ' +
                              'text-xs transition-colors'
                            }
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loading state */}
                  {aiLoading && (
                    <div
                      className={
                        'flex flex-col items-center ' +
                        'justify-center py-10 gap-3'
                      }
                    >
                      <Loader2
                        className="w-7 h-7 text-indigo-400 animate-spin"
                      />
                      <p className="text-zinc-600 text-xs">
                        Searching your knowledge base...
                      </p>
                    </div>
                  )}

                  {/* Response state */}
                  {aiResponse && !aiLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* User bubble */}
                      <div className="flex justify-end">
                        <div
                          className={
                            'max-w-[80%] px-3 py-2 ' +
                            'rounded-2xl rounded-tr-sm ' +
                            'bg-indigo-600 text-white ' +
                            'text-sm leading-relaxed'
                          }
                        >
                          {question}
                        </div>
                      </div>

                      {/* AI bubble */}
                      <div className="flex justify-start">
                        <div
                          className={
                            'max-w-[85%] px-3 py-2 ' +
                            'rounded-2xl rounded-tl-sm ' +
                            'bg-zinc-800 text-zinc-200 ' +
                            'text-sm leading-relaxed'
                          }
                        >
                          {aiResponse.answer}
                        </div>
                      </div>

                      {/* Source citations */}
                      {aiResponse.sources?.length > 0 && (
                        <div className="pt-2">
                          <p
                            className={
                              'text-[10px] text-zinc-600 ' +
                              'uppercase tracking-wider mb-1.5'
                            }
                          >
                            Sources
                          </p>
                          <div className="space-y-1">
                            {aiResponse.sources.map((src) => (
                              <Link
                                key={src.id}
                                href={`/item/${src.id}`}
                                className={
                                  'block px-3 py-2 rounded-lg ' +
                                  'bg-zinc-900 border border-zinc-800 ' +
                                  'hover:border-indigo-500/40 ' +
                                  'transition-colors'
                                }
                              >
                                <p
                                  className={
                                    'text-xs text-zinc-300 ' +
                                    'font-medium truncate'
                                  }
                                >
                                  {src.title}
                                </p>
                                <p
                                  className={
                                    'text-[10px] text-zinc-600 ' +
                                    'mt-0.5 line-clamp-1'
                                  }
                                >
                                  {src.relevance}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Input bar */}
                <div className="p-3 border-t border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAiQuery();
                      }}
                      placeholder="Ask your brain..."
                      className={
                        'flex-1 px-3 py-2 rounded-xl ' +
                        'bg-zinc-800 border border-zinc-700 ' +
                        'text-white text-sm placeholder-zinc-600 ' +
                        'focus:outline-none focus:border-indigo-500 ' +
                        'transition-colors'
                      }
                    />
                    <button
                      onClick={handleAiQuery}
                      disabled={!question.trim() || aiLoading}
                      className={
                        'p-2 rounded-xl bg-indigo-600 ' +
                        'hover:bg-indigo-500 text-white ' +
                        'disabled:opacity-40 ' +
                        'disabled:cursor-not-allowed ' +
                        'transition-colors'
                      }
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}