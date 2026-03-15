# 🧠 Second Brain — AI Powered Knowledge System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97706?style=for-the-badge&logo=anthropic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A sophisticated AI-powered knowledge management platform that captures, organizes, and intelligently surfaces information using Claude AI by Anthropic — delivering fast, reliable, and intelligent responses via secure server-side API calls.**

[🚀 Live Demo](https://second-brain-frontend-engineering.vercel.app) · [📡 Public API](https://second-brain-frontend-engineering.vercel.app/api/public/brain/query?q=What+is+in+this+knowledge+base%3F) · [📖 Docs Page](https://second-brain-frontend-engineering.vercel.app/docs)

</div>

---

> **Live Demo:** Visit [second-brain-frontend-engineering.vercel.app](https://second-brain-frontend-engineering.vercel.app) to see the full application in production.

---

## What is Second Brain?

Second Brain is a full-stack, AI-powered knowledge management platform built as part of the Altibbe/Hedamo technical assessment. It goes beyond a simple note-taking app — it is an **intelligent infrastructure for thought**. Users capture insights, articles, and ideas in one place, then use AI to summarize content, automatically tag entries, and query their entire knowledge base conversationally.

The system is designed around one core principle: **knowledge should work for you, not the other way around**. Every piece of content you save becomes smarter over time as AI enriches it with summaries and tags stored permanently in the database.

---

## Core Features

**Knowledge Capture** gives users a rich form to create knowledge items with required fields (title, content, type) and optional metadata including tags and source URLs. Items are timestamped and stored in PostgreSQL with a clean, indexed schema.

**Smart Dashboard** is the central hub displaying all knowledge items in a searchable, filterable grid. Users can filter by type (note, link, insight), sort by date or alphabetically, and click through to detailed views with full content and AI-generated metadata.

**AI Summarization** generates concise 2–3 sentence summaries using Claude AI by Anthropic. Summaries are stored permanently in the database on first generation — so they load instantly on subsequent views without additional API calls.

**AI Auto-Tagging** intelligently categorizes content by generating 3–5 lowercase hyphenated tags. AI-generated tags are stored in a dedicated `ai_tags` column, kept strictly separate from user-defined tags. This separation enables future trust-scoring features by distinguishing human judgment from machine judgment.

**Conversational Q&A** implements a RAG-lite (Retrieval Augmented Generation) pattern — users ask natural language questions and the AI synthesizes answers by reasoning over the full knowledge base, citing specific items with UUID-level source attribution.

**Public REST API** exposes the system's intelligence as a GET endpoint, allowing any external tool, bot, or integration to query the knowledge base and receive structured JSON responses with answers, cited sources, and metadata.

---

## Tech Stack

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| Frontend | Next.js 14 (App Router) | File-based routing, server components, API routes in one framework |
| UI | React 18 + Tailwind CSS | Component reuse + utility-first styling for rapid, consistent UI |
| Animations | Framer Motion | Physics-based spring animations and scroll-triggered effects |
| Backend | Next.js API Routes | Co-located server logic, no separate Express server needed |
| Database | Supabase (PostgreSQL) | Row Level Security, real-time capability, free tier with generous limits |
| AI | Claude AI by Anthropic | See AI section below for full details |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Dates | date-fns | Lightweight date utilities without moment.js overhead |
| Deployment | Vercel | Zero-config Next.js deployment, edge CDN, automatic CI/CD |
| Language | TypeScript | End-to-end type safety from database types to API responses |

---

## AI Integration — Claude API by Anthropic

This project uses **Claude AI by Anthropic** for all AI-powered features, accessed via secure server-side API calls. Claude is one of the most capable and reliable large language models available, making it an ideal choice for tasks that require precise summarization, structured JSON output, and nuanced conversational reasoning.

All AI calls are made exclusively from server-side Next.js API routes — the `ANTHROPIC_API_KEY` is never exposed to the browser, ensuring the key remains fully secure at all times.

The AI layer is encapsulated entirely within `lib/ai.ts`, which exports three functions used across the application:

`summarizeContent(title, content)` calls Claude to generate a focused 2–3 sentence summary of a knowledge item. The result is stored permanently in the `summary` column of the database, so subsequent page loads retrieve it instantly without additional API usage.

`generateTags(title, content)` prompts Claude to return a JSON array of 3–5 lowercase hyphenated tags. Claude is instructed to return strict JSON with no additional text, making the response predictable and easy to parse. Tags are stored in a dedicated `ai_tags` column separate from user-defined tags.

`queryKnowledgeBase(question, items)` implements a RAG-lite pattern by formatting all knowledge items as structured context blocks and passing them to Claude alongside the user's question. Claude synthesizes a cited answer referencing specific item UUIDs, which the frontend renders as clickable source cards.

The clean separation of this AI layer means the underlying model provider can be swapped by editing only `lib/ai.ts` — no changes are required in any API route, component, or page. This demonstrates the portable architecture principle that is a core requirement of this assessment.

---

## Architecture

```
second-brain/
├── app/
│   ├── page.tsx                          # Landing page — parallax hero, features grid, CTA
│   ├── dashboard/page.tsx                # Main dashboard + real-time AI chat panel
│   ├── capture/page.tsx                  # Knowledge capture form with AI preview
│   ├── item/[id]/page.tsx                # Item detail view with inline AI actions
│   ├── docs/page.tsx                     # Architecture documentation page
│   └── api/
│       ├── knowledge/route.ts            # GET (list + filter + search), POST (create)
│       ├── knowledge/[id]/route.ts       # GET (single), PUT (update), DELETE
│       ├── ai/summarize/route.ts         # AI summarization endpoint
│       ├── ai/autotag/route.ts           # AI auto-tagging endpoint
│       ├── ai/query/route.ts             # Conversational Q&A endpoint
│       └── public/brain/query/route.ts   # 🌐 Public REST API endpoint
├── components/
│   ├── Navbar.tsx                        # Fixed nav with scroll-aware background
│   ├── KnowledgeCard.tsx                 # Animated card with hover states
│   ├── SearchBar.tsx                     # Controlled search with clear button
│   └── SkeletonCard.tsx                  # Loading placeholder matching card layout
├── lib/
│   ├── supabase.ts                       # Supabase client (singleton pattern)
│   ├── ai.ts                             # AI utility functions — SERVER ONLY
│   └── types.ts                          # Shared TypeScript interfaces
└── supabase/
    └── schema.sql                        # Database initialization script
```

### Portable Architecture

The system is built around strict separation of concerns. Each layer is independently replaceable without affecting any other layer:

- **Frontend layer**: Next.js → swappable with Remix, SvelteKit, or Vue 3
- **Database layer**: Supabase → swappable with Neon, PlanetScale, or MongoDB
- **AI layer**: Claude AI → swappable with OpenAI GPT-4o or Gemini by editing only `lib/ai.ts`

### RAG-lite Pattern

The conversational Q&A feature uses a simplified Retrieval Augmented Generation pattern. Rather than a vector database with semantic embeddings, all knowledge items are formatted as structured context blocks and passed directly to Claude. This approach is faster, simpler, and equally effective for knowledge bases under ~200 items — which aligns with the scope of this application.

---

## Public API Reference

The public API endpoint allows external tools to query your knowledge base without authentication.

**Endpoint:**
```
GET /api/public/brain/query?q=your+question
```

**Example request:**
```
GET https://second-brain-frontend-engineering.vercel.app/api/public/brain/query?q=What+is+Hedamo
```

**Example response:**
```json
{
  "question": "What is Hedamo?",
  "answer": "Hedamo is a digital platform built by Altibbe Health that helps food and wellness producers build consumer trust through transparency and compliance.",
  "sources": [
    {
      "id": "b36baa5a-d65b-4358-b6cb-4159df4174b6",
      "title": "Hedamo and Altibbe Health — Product Overview",
      "relevance": "This insight provides a direct overview of Hedamo's product and mission."
    }
  ],
  "meta": {
    "total_items_queried": 4,
    "timestamp": "2026-03-15T10:00:00.000Z",
    "powered_by": "Claude AI (Anthropic)"
  }
}
```

**All API endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/knowledge` | List all items — supports `?search=`, `?type=`, `?sort=` |
| `POST` | `/api/knowledge` | Create a new knowledge item |
| `GET` | `/api/knowledge/:id` | Fetch a single item by UUID |
| `PUT` | `/api/knowledge/:id` | Update an existing item |
| `DELETE` | `/api/knowledge/:id` | Permanently delete an item |
| `POST` | `/api/ai/summarize` | Generate and persist an AI summary |
| `POST` | `/api/ai/autotag` | Generate and persist AI-suggested tags |
| `POST` | `/api/ai/query` | Conversational Q&A over the full knowledge base |
| `GET` | `/api/public/brain/query` | **Public endpoint** — query via `?q=` parameter |

---

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed and ready:

- **Node.js 18+** — check with `node --version`
- **A Supabase account** — free at [supabase.com](https://supabase.com) (no credit card needed)
- **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone and Install

```bash
git clone https://github.com/ThurubilliSaiManoj2026/second-brain-Frontend-Engineering.git
cd second-brain-Frontend-Engineering
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase — from your project's Settings → Data API page
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here

# Anthropic Claude — from console.anthropic.com → API Keys
ANTHROPIC_API_KEY=sk-ant-...your_key_here
```

> ⚠️ The `ANTHROPIC_API_KEY` has no `NEXT_PUBLIC_` prefix intentionally — it must **never** be exposed to the browser. It is only read by server-side API routes.

### 3. Initialize the Database

Open your Supabase project, navigate to the **SQL Editor**, and run the full contents of `supabase/schema.sql`. This creates the `knowledge_items` table with all required columns, indexes, Row Level Security policies, and an auto-update trigger for the `updated_at` timestamp.

You should see `Success. No rows returned` — this is correct, as `CREATE TABLE` statements don't return rows.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the landing page with the dark parallax hero section.

---

## Deployment

This project is deployed on Vercel with zero configuration required beyond environment variables.

### Deploy Your Own

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel and it will deploy automatically on every push to `main`.

### Required Environment Variables on Vercel

Add these in your Vercel project under **Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (server-only, never exposed to browser) |

---

## UI/UX Design Principles

**Progressive Disclosure** — AI features are surfaced contextually at the point of creation, not buried in settings menus. Users discover summarization and auto-tagging naturally when they need them.

**Speed as a Feature** — Skeleton loaders appear instantly during data fetching. Optimistic UI updates (card removal, state changes) precede server confirmation, making the app feel faster than it technically is.

**Transparency in AI** — AI-generated content (summaries, `ai_tags`) is visually distinguished from user-authored content with indigo "AI Summary" badges and separate tag columns. Users can always inspect and understand what the AI contributed.

**Motion with Purpose** — Every animation communicates state, not decoration. Card entrance animations confirm data freshness. Hover states respond immediately to signal interactivity. The AI panel springs open with a natural physics curve that matches Framer Motion's spring defaults.

**Dark-First Design** — A deep `#0a0a0a` background reduces eye strain during extended knowledge work sessions. Color is used purposefully: indigo for primary actions, blue for notes, emerald for links, violet for insights.

---

## Database Schema

```sql
CREATE TABLE knowledge_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('note', 'link', 'insight')),
  tags        TEXT[] DEFAULT '{}',      -- User-defined tags
  source_url  TEXT,
  summary     TEXT,                     -- AI-generated, stored permanently
  ai_tags     TEXT[] DEFAULT '{}',      -- AI-generated tags, separate from user tags
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

The separation of `tags` (user-defined) and `ai_tags` (AI-generated) is an intentional architectural decision. Storing them in separate columns rather than merging them into one array means the system can later build trust-scoring features — for example, surfacing items where AI and human agree on categorization as a quality signal.

---

## Development Notes

**Environment variable changes require a full server restart.** Next.js reads `.env.local` once at startup, not on every request. After changing any variable, press `Ctrl+C` and run `npm run dev` again.

**`lib/ai.ts` is server-only.** Never import it in any component marked `'use client'`. The Anthropic SDK uses `process.env.ANTHROPIC_API_KEY` which only exists on the server. If you accidentally import it client-side, Next.js will throw a build error.

**Supabase Row Level Security is enabled** on the `knowledge_items` table with a permissive policy for development. Before adding user authentication, tighten this policy to scope access by `auth.uid()`.

---

## License

MIT License — feel free to use this project as a reference or starting point for your own knowledge management tools.

---

## Author

**Thurubilli Sai Manoj**

Built as part of the Altibbe/Hedamo Full-Stack Engineering Internship Assessment — demonstrating full-stack development, AI integration, system architecture, and product thinking.

---

<div align="center">

**⭐ If this project helped you, consider giving it a star on GitHub**

[Live Demo](https://second-brain-frontend-engineering.vercel.app) · [Public API](https://second-brain-frontend-engineering.vercel.app/api/public/brain/query?q=What+is+in+this+knowledge+base%3F) · [Docs](https://second-brain-frontend-engineering.vercel.app/docs)

</div>
