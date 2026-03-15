import { Layers, Zap, Cpu, Globe, BookOpen } from 'lucide-react';

// This page is server-side rendered (no 'use client') because it
// contains only static content — no state, no interactivity.
// This makes it faster and better for SEO.
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">

        {/* ── Page Header ── */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Architecture & Documentation
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Technical documentation covering system design, UX
            principles, agent thinking, and infrastructure for
            Second Brain.
          </p>
        </div>

        {/* ════════════════════════════════════
            1. PORTABLE ARCHITECTURE
        ════════════════════════════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={
                'w-9 h-9 rounded-xl bg-blue-500/20 ' +
                'flex items-center justify-center'
              }
            >
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              1. Portable Architecture
            </h2>
          </div>
          <div
            className={
              'bg-[#111111] border border-zinc-800 ' +
              'rounded-2xl p-6'
            }
          >
            <p className="text-zinc-400 mb-5 leading-relaxed">
              The system is built around clean separation of
              concerns. Each layer — data, logic, AI, and UI — is
              independently replaceable without affecting the
              others. This makes the codebase maintainable,
              testable, and easy to extend.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  layer: 'Frontend',
                  current: 'Next.js + React',
                  swap: 'Vue 3, Remix, SvelteKit',
                  color: 'border-blue-500/30 bg-blue-500/5',
                },
                {
                  layer: 'Database',
                  current: 'Supabase (PostgreSQL)',
                  swap: 'MongoDB, Neon, PlanetScale',
                  color: 'border-emerald-500/30 bg-emerald-500/5',
                },
                {
                  layer: 'AI Layer',
                  current: 'Anthropic Claude',
                  swap: 'OpenAI GPT-4o, Gemini 1.5',
                  color: 'border-violet-500/30 bg-violet-500/5',
                },
              ].map((item) => (
                <div
                  key={item.layer}
                  className={`p-4 rounded-xl border ${item.color}`}
                >
                  <div
                    className={
                      'text-[10px] text-zinc-600 ' +
                      'uppercase tracking-widest mb-1'
                    }
                  >
                    Layer
                  </div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {item.layer}
                  </div>
                  <div className="text-zinc-300 text-sm mb-2">
                    {item.current}
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    Swappable → {item.swap}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            2. UX PRINCIPLES
        ════════════════════════════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={
                'w-9 h-9 rounded-xl bg-amber-500/20 ' +
                'flex items-center justify-center'
              }
            >
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              2. Principles-Based UX
            </h2>
          </div>
          <div
            className={
              'bg-[#111111] border border-zinc-800 ' +
              'rounded-2xl p-6'
            }
          >
            <div className="space-y-6">
              {[
                {
                  n: '01',
                  title: 'Progressive Disclosure',
                  body:
                    'AI features are surfaced contextually and ' +
                    'never forced. Users discover summarization ' +
                    'and auto-tagging naturally at the point of ' +
                    'creation, not through a buried settings menu.',
                },
                {
                  n: '02',
                  title: 'Speed as a Feature',
                  body:
                    'Skeleton loaders appear instantly during data ' +
                    'fetching. Optimistic UI updates (e.g., card ' +
                    'removal) precede server confirmation, making ' +
                    'the app feel faster than it technically is.',
                },
                {
                  n: '03',
                  title: 'Transparency in AI',
                  body:
                    'AI-generated content (summaries, ai_tags) is ' +
                    'clearly distinguished from user-authored content' +
                    ' with visual indicators. Users can inspect, ' +
                    'accept, or reject all AI suggestions.',
                },
                {
                  n: '04',
                  title: 'Dark-First Design',
                  body:
                    'A deep #0a0a0a background reduces eye strain ' +
                    'during extended knowledge work sessions. Color ' +
                    'is used purposefully — indigo for primary ' +
                    'actions, semantic colors for type identity.',
                },
                {
                  n: '05',
                  title: 'Motion with Purpose',
                  body:
                    'Every animation communicates state, not ' +
                    'decoration. Card entrance animations confirm ' +
                    'data freshness; hover states signal ' +
                    'interactivity; the AI panel springs open with ' +
                    'a natural physics curve.',
                },
              ].map((p) => (
                <div key={p.n} className="flex gap-4">
                  <span
                    className={
                      'text-indigo-500 font-mono text-sm ' +
                      'mt-0.5 w-8 flex-shrink-0'
                    }
                  >
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {p.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            3. AGENT THINKING
        ════════════════════════════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={
                'w-9 h-9 rounded-xl bg-green-500/20 ' +
                'flex items-center justify-center'
              }
            >
              <Cpu className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              3. Agent Thinking
            </h2>
          </div>
          <div
            className={
              'bg-[#111111] border border-zinc-800 ' +
              'rounded-2xl p-6'
            }
          >
            <p className="text-zinc-400 mb-5 leading-relaxed">
              The system implements four automation patterns that
              actively maintain and improve the knowledge base over
              time, without requiring constant manual effort.
            </p>
            <ul className="space-y-4">
              {[
                {
                  title: 'Persistent AI Enrichment',
                  desc:
                    'When a user generates a summary or AI tags, ' +
                    'those are stored permanently in the database. ' +
                    'The next time the item loads, AI enrichment is' +
                    ' instantly available — no re-processing needed.',
                },
                {
                  title: 'Separation of Tag Authority',
                  desc:
                    'User tags and AI tags live in separate columns.' +
                    ' This enables future features like "items where' +
                    ' AI and user agree on tags" — a foundation for ' +
                    'trust scoring and quality signals.',
                },
                {
                  title: 'RAG-Lite Querying',
                  desc:
                    'The /api/ai/query endpoint retrieves all items ' +
                    'and passes them as structured context to Claude.' +
                    ' This implements Retrieval Augmented Generation ' +
                    'without a vector database.',
                },
                {
                  title: 'Public API as Distribution',
                  desc:
                    'The GET /api/public/brain/query endpoint lets ' +
                    'external bots and integrations query the ' +
                    'knowledge base. The brain distributes its ' +
                    'intelligence beyond the UI.',
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div
                    className={
                      'w-1.5 h-1.5 rounded-full ' +
                      'bg-green-500 mt-2 flex-shrink-0'
                    }
                  />
                  <div>
                    <span className="text-white font-medium text-sm">
                      {item.title}:{' '}
                    </span>
                    <span className="text-zinc-500 text-sm">
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ════════════════════════════════════
            4. INFRASTRUCTURE
        ════════════════════════════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={
                'w-9 h-9 rounded-xl bg-indigo-500/20 ' +
                'flex items-center justify-center'
              }
            >
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              4. Infrastructure Mindset
            </h2>
          </div>
          <div
            className={
              'bg-[#111111] border border-zinc-800 ' +
              'rounded-2xl p-6 space-y-6'
            }
          >
            <div>
              <h3 className="font-semibold text-white mb-3">
                Public REST API
              </h3>
              <code
                className={
                  'block px-4 py-3 rounded-xl ' +
                  'bg-zinc-900 border border-zinc-800 ' +
                  'text-green-400 text-sm font-mono'
                }
              >
                GET /api/public/brain/query?q=your+question
              </code>
              <div
                className={
                  'mt-4 rounded-xl bg-zinc-900 ' +
                  'border border-zinc-800 p-4'
                }
              >
                <p
                  className={
                    'text-[11px] text-zinc-600 ' +
                    'mb-2 uppercase tracking-wider'
                  }
                >
                  Example response
                </p>
                <pre
                  className={
                    'text-xs text-zinc-400 ' +
                    'overflow-x-auto leading-relaxed'
                  }
                >
{`{
  "question": "What do I know about machine learning?",
  "answer": "Based on your notes...",
  "sources": [
    {
      "id": "550e8400-...",
      "title": "Attention Is All You Need",
      "relevance": "Discusses transformer architecture"
    }
  ],
  "meta": {
    "total_items_queried": 24,
    "timestamp": "2026-03-15T10:00:00.000Z",
    "powered_by": "Claude AI (Anthropic)"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                Deployment Stack
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    s: 'Vercel',
                    r: 'Frontend + API routes, edge CDN, CI/CD',
                  },
                  {
                    s: 'Supabase',
                    r: 'PostgreSQL + row-level security + realtime',
                  },
                  {
                    s: 'Anthropic',
                    r: 'Claude Haiku for cost-efficient AI processing',
                  },
                  {
                    s: 'GitHub',
                    r: 'Version control + automatic Vercel deployments',
                  },
                ].map((row) => (
                  <div
                    key={row.s}
                    className={
                      'p-3 rounded-xl ' +
                      'bg-zinc-900 border border-zinc-800'
                    }
                  >
                    <div className="text-white font-medium text-sm">
                      {row.s}
                    </div>
                    <div
                      className={
                        'text-zinc-500 text-xs mt-0.5 leading-relaxed'
                      }
                    >
                      {row.r}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            5. API REFERENCE TABLE
        ════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div
              className={
                'w-9 h-9 rounded-xl bg-zinc-800 ' +
                'flex items-center justify-center'
              }
            >
              <BookOpen className="w-5 h-5 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              5. Full API Reference
            </h2>
          </div>
          <div
            className={
              'bg-[#111111] border border-zinc-800 ' +
              'rounded-2xl overflow-hidden'
            }
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={
                    'text-left text-zinc-600 ' +
                    'border-b border-zinc-800 bg-zinc-900/50'
                  }
                >
                  <th className="px-5 py-3 font-medium">Endpoint</th>
                  <th className="px-5 py-3 font-medium">Method</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {[
                  { ep: '/api/knowledge',          m: 'GET',    d: 'List all items — supports ?search, ?type, ?sort' },
                  { ep: '/api/knowledge',          m: 'POST',   d: 'Create a new knowledge item' },
                  { ep: '/api/knowledge/:id',      m: 'GET',    d: 'Fetch a single item by UUID' },
                  { ep: '/api/knowledge/:id',      m: 'PUT',    d: 'Update an existing item' },
                  { ep: '/api/knowledge/:id',      m: 'DELETE', d: 'Permanently delete an item' },
                  { ep: '/api/ai/summarize',       m: 'POST',   d: 'Generate & persist an AI summary' },
                  { ep: '/api/ai/autotag',         m: 'POST',   d: 'Generate & persist AI tags' },
                  { ep: '/api/ai/query',           m: 'POST',   d: 'Conversational Q&A over the knowledge base' },
                  { ep: '/api/public/brain/query', m: 'GET',    d: 'Public API: query the brain via ?q=' },
                ].map((row) => {
                  const methodColor =
                    row.m === 'GET'    ? 'bg-emerald-900/40 text-emerald-400' :
                    row.m === 'POST'   ? 'bg-blue-900/40 text-blue-400'       :
                    row.m === 'PUT'    ? 'bg-amber-900/40 text-amber-400'     :
                    'bg-red-900/40 text-red-400';

                  return (
                    <tr
                      key={row.ep + row.m}
                      className="hover:bg-zinc-900/40 transition-colors"
                    >
                      <td
                        className={
                          'px-5 py-3 font-mono text-xs text-zinc-300'
                        }
                      >
                        {row.ep}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={
                            'px-2 py-0.5 rounded ' +
                            'text-xs font-mono font-medium ' +
                            methodColor
                          }
                        >
                          {row.m}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3 text-zinc-500 text-xs"
                      >
                        {row.d}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}