import { NextRequest, NextResponse } from 'next/server';
import { generateTags } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// POST /api/ai/autotag
// Body: { title, content, id? }
//
// Generates AI-suggested tags for a knowledge item using Groq.
// If an item ID is provided, the tags are stored permanently in the
// ai_tags column — kept separate from user-defined tags intentionally.
// This separation enables future features like trust scoring between
// what the user thinks vs what AI thinks about a piece of content.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content } = body ?? {};

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
    }

    // Generate tags using Groq via our server-side AI utility
    const tags = await generateTags(title, content);

    // Persist AI tags to the database if an item ID was provided
    if (id) {
      await supabase
        .from('knowledge_items')
        .update({ ai_tags: tags })
        .eq('id', id);
    }

    return NextResponse.json({ tags });
  } catch (err: unknown) {
    console.error('[POST /api/ai/autotag] Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}