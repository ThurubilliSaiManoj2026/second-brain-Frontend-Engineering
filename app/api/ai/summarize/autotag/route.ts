import { NextRequest, NextResponse } from 'next/server';
import { generateTags } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// POST /api/ai/autotag
// Generates AI-suggested tags and stores them in the ai_tags column.
// Note: AI tags are kept separate from user-defined tags intentionally.
// This separation lets us distinguish what the user thinks vs what AI thinks.
export async function POST(request: NextRequest) {
  try {
    const { id, title, content } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
    }

    const tags = await generateTags(title, content);

    // Persist AI tags to the dedicated ai_tags column if item ID provided
    if (id) {
      await supabase
        .from('knowledge_items')
        .update({ ai_tags: tags })
        .eq('id', id);
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('[POST /api/ai/autotag]', error);
    return NextResponse.json(
      { error: 'Failed to generate tags' },
      { status: 500 }
    );
  }
}