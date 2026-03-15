import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// POST /api/ai/query
// Body: { question: string }
// Fetches all knowledge items from Supabase and passes them as
// RAG context to Claude, which synthesizes a cited answer.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question: string = body?.question ?? '';

    if (!question.trim()) {
      return NextResponse.json(
        { error: 'question is required' },
        { status: 400 }
      );
    }

    // Step 1 — Fetch the full knowledge base from Supabase
    const { data: items, error: dbError } = await supabase
      .from('knowledge_items')
      .select('*');

    if (dbError) {
      // This means Supabase credentials are wrong or the table does not exist
      console.error('[POST /api/ai/query] Supabase error:', dbError);
      return NextResponse.json(
        {
          error: 'Database error: ' + dbError.message,
          hint: 'Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
        },
        { status: 500 }
      );
    }

    // Step 2 — Handle empty knowledge base gracefully without calling Claude
    if (!items || items.length === 0) {
      return NextResponse.json({
        answer:
          'Your knowledge base is empty. Add some notes, links, or insights first and I will be able to answer questions about them!',
        sources: [],
      });
    }

    // Step 3 — Call Claude with the full knowledge base as context
    const result = await queryKnowledgeBase(question, items);
    return NextResponse.json(result);

  } catch (err: unknown) {
    // Log the REAL error so you can see it in the VS Code terminal
    console.error('[POST /api/ai/query] Unexpected error:', err);

    // Also return a descriptive message to the client in development
    const message = err instanceof Error ? err.message : String(err);

    // Common error patterns and what they mean
    let hint = 'Check the VS Code terminal for the full error.';
    if (message.includes('401') || message.includes('auth')) {
      hint =
        'Your ANTHROPIC_API_KEY is invalid or missing. ' +
        'Go to console.anthropic.com, copy your key, and paste it into .env.local. ' +
        'Then restart npm run dev.';
    } else if (message.includes('credit') || message.includes('529') || message.includes('overload')) {
      hint =
        'Your Anthropic account has no credits. ' +
        'Go to console.anthropic.com/settings/billing and add credits.';
    } else if (message.includes('model')) {
      hint = 'The model name in lib/ai.ts may be invalid.';
    }

    return NextResponse.json(
      { error: message, hint },
      { status: 500 }
    );
  }
}