import { NextRequest, NextResponse } from 'next/server';
import { summarizeContent } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// POST /api/ai/summarize
// Generates an AI summary and optionally persists it to the database.
// If an item ID is provided, the summary is stored permanently so it
// never needs to be regenerated on future loads — saving API costs.
export async function POST(request: NextRequest) {
  try {
    const { id, title, content } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
    }

    // Call Claude via our server-side AI utility
    const summary = await summarizeContent(title, content);

    // If an item ID was provided, persist the summary to the database
    if (id) {
      await supabase
        .from('knowledge_items')
        .update({ summary })
        .eq('id', id);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[POST /api/ai/summarize]', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}