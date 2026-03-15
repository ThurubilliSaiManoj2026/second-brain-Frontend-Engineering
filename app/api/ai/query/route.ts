import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// POST /api/ai/query
// Body: { question: string }
//
// This is the endpoint the Dashboard "Ask AI" panel calls.
// It fetches ALL knowledge items from Supabase, passes them as
// context to Claude, and returns a synthesized answer with sources.
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

    // Fetch the full knowledge base from Supabase to use as AI context
    const { data: items, error: dbError } = await supabase
      .from('knowledge_items')
      .select('*');

    if (dbError) {
      console.error('[POST /api/ai/query] Supabase error:', dbError);
      return NextResponse.json(
        { error: 'Database error: ' + dbError.message },
        { status: 500 }
      );
    }

    // If the knowledge base is empty, return a helpful message
    // without wasting an API call to Claude
    if (!items || items.length === 0) {
      return NextResponse.json({
        answer:
          'Your knowledge base is empty. ' +
          'Add some notes, links, or insights first!',
        sources: [],
      });
    }

    // Call Claude with all items as structured RAG context
    const result = await queryKnowledgeBase(question, items);
    return NextResponse.json(result);

  } catch (err: unknown) {
    // Log the REAL error to the VS Code terminal for debugging
    console.error('[POST /api/ai/query] Error:', err);

    const message = err instanceof Error ? err.message : String(err);

    // Provide a meaningful hint based on the error type
    let hint = 'Check the terminal for details.';
    if (message.includes('401') || message.includes('authentication')) {
      hint =
        'Your ANTHROPIC_API_KEY is invalid. ' +
        'Check .env.local and restart npm run dev.';
    } else if (
      message.includes('529') ||
      message.includes('credit') ||
      message.includes('overload')
    ) {
      hint =
        'No Anthropic credits. ' +
        'Add billing at console.anthropic.com/settings/billing';
    }

    return NextResponse.json({ error: message, hint }, { status: 500 });
  }
}