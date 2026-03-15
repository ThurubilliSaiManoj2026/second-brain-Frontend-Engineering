import Groq from 'groq-sdk';
import type { KnowledgeItem, AIQueryResponse } from './types';

// SERVER-SIDE ONLY — never import this in a 'use client' component.
// GROQ_API_KEY has no NEXT_PUBLIC_ prefix so it never reaches the browser.
//
// Why Groq?
// Groq built custom LPU (Language Processing Unit) hardware specifically
// for AI inference — delivering responses 5-10x faster than GPU-based
// providers like OpenAI or Google. The free tier gives 14,400 req/day
// with no credit card required, making it ideal for this project.
// This choice demonstrates knowledge of the broader AI infrastructure
// ecosystem beyond single-vendor dependency.

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error(
    '[AI] GROQ_API_KEY is missing from .env.local. ' +
    'Get a free key at console.groq.com and add it, then restart npm run dev.'
  );
}

const groq = new Groq({ apiKey: apiKey ?? '' });

// llama-3.1-8b-instant: fast, free, and highly capable for our three tasks —
// summarization, tag generation, and conversational Q&A over a knowledge base.
const MODEL = 'llama-3.1-8b-instant';

// ─────────────────────────────────────────────────────────────────
// readError — converts any thrown value into a human-readable string.
// Without this, Node.js logs caught SDK errors as "[Object]" because
// console.error only calls .toString() rather than inspecting properties.
// ─────────────────────────────────────────────────────────────────
function readError(err: unknown): string {
  try {
    if (err instanceof Error) {
      const e = err as Error & { status?: number; error?: unknown };
      const parts: string[] = [e.message];
      if (e.status) parts.push('HTTP ' + e.status);
      if (e.error) parts.push('detail: ' + JSON.stringify(e.error));
      return parts.join(' | ');
    }
    return JSON.stringify(err, null, 2);
  } catch {
    return String(err);
  }
}

// ─────────────────────────────────────────────────────────────────
// summarizeContent
// Generates a 2-3 sentence summary of a knowledge item.
// Stored permanently in the database so it never needs to be
// regenerated on future loads — saving API quota and load time.
// ─────────────────────────────────────────────────────────────────
export async function summarizeContent(
  title: string,
  content: string
): Promise<string> {
  console.log('[AI] summarizeContent ->', title);
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 200,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are a precise summarization assistant. ' +
            'Return ONLY the summary text — no labels, no preamble.',
        },
        {
          role: 'user',
          content:
            'Summarize this knowledge item in 2-3 sentences. ' +
            'Capture the core insight precisely.\n\n' +
            'Title: ' + title + '\n' +
            'Content: ' + content,
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    console.error('[AI] summarizeContent FAILED:', readError(err));
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────
// generateTags
// Returns 3-5 lowercase hyphenated tags as a parsed string array.
// AI tags are stored in a separate ai_tags column from user tags,
// keeping human and machine judgment clearly separated.
// ─────────────────────────────────────────────────────────────────
export async function generateTags(
  title: string,
  content: string
): Promise<string[]> {
  console.log('[AI] generateTags ->', title);
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 100,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a tagging assistant. ' +
            'Return ONLY a valid JSON array of strings. ' +
            'No explanation, no backticks, no markdown.',
        },
        {
          role: 'user',
          content:
            'Generate 3-5 relevant tags for this knowledge item. ' +
            'Return ONLY a JSON array of lowercase hyphenated strings.\n' +
            'Example: ["machine-learning","research","neural-networks"]\n\n' +
            'Title: ' + title + '\n' +
            'Content: ' + content,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';
    console.log('[AI] generateTags raw:', raw);

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      const matches = raw.match(/"([^"]+)"/g);
      return matches ? matches.map((m) => m.replace(/"/g, '')) : [];
    }
  } catch (err) {
    console.error('[AI] generateTags FAILED:', readError(err));
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────
// queryKnowledgeBase
// RAG-lite pattern: all knowledge items are formatted as a structured
// context block and passed to Llama 3.1, which synthesizes a cited
// answer to the user's natural language question.
//
// Why RAG-lite without a vector database?
// For knowledge bases under ~200 items, passing everything directly
// as text context is faster, simpler, and just as effective as
// embedding-based retrieval. No extra infrastructure needed.
// ─────────────────────────────────────────────────────────────────
export async function queryKnowledgeBase(
  question: string,
  items: KnowledgeItem[]
): Promise<AIQueryResponse> {
  console.log(
    '[AI] queryKnowledgeBase -> items:', items.length,
    '| question:', question
  );

  const context = items
    .map(
      (item) =>
        '[ID: ' + item.id + ']\n' +
        'Title: ' + item.title + '\n' +
        'Type: ' + item.type + '\n' +
        'Content: ' + item.content + '\n' +
        'Tags: ' + [...(item.tags ?? []), ...(item.ai_tags ?? [])].join(', ')
    )
    .join('\n\n---\n\n');

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 700,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'You are a personal knowledge assistant. ' +
            'Answer questions using ONLY the knowledge base provided. ' +
            'If the answer is not present, say so clearly. ' +
            'Respond with ONLY valid JSON — no backticks, no markdown:\n' +
            '{\n' +
            '  "answer": "your synthesized answer here",\n' +
            '  "sources": [\n' +
            '    { "id": "exact-uuid", "title": "Item Title", "relevance": "one sentence" }\n' +
            '  ]\n' +
            '}',
        },
        {
          role: 'user',
          content: 'KNOWLEDGE BASE:\n' + context + '\n\nQUESTION: ' + question,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';
    console.log('[AI] raw response:', raw.slice(0, 300));

    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned) as AIQueryResponse;
    } catch {
      console.warn('[AI] JSON parse failed, returning raw text as answer');
      return { answer: raw, sources: [] };
    }
  } catch (err) {
    console.error('[AI] queryKnowledgeBase FAILED:', readError(err));
    throw err;
  }
}