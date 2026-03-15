import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateKnowledgeInput } from '@/lib/types';

// GET /api/knowledge
// Fetches all knowledge items with optional filtering and sorting.
// Query params: ?search=, ?type=, ?tag=, ?sort=
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const type   = searchParams.get('type');
  const tag    = searchParams.get('tag');
  const sort   = searchParams.get('sort') || 'created_at';

  try {
    let query = supabase
      .from('knowledge_items')
      .select('*')
      .order(sort === 'title' ? 'title' : sort, {
        ascending: sort === 'title',
      });

    // Full-text search across title and content columns
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Filter by item type (note / link / insight)
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    // Filter by a specific tag using PostgreSQL array contains operator
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('[GET /api/knowledge]', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge items' },
      { status: 500 }
    );
  }
}

// POST /api/knowledge
// Creates a new knowledge item in the database.
// Body: { title, content, type, tags?, source_url? }
export async function POST(request: NextRequest) {
  try {
    const body: CreateKnowledgeInput = await request.json();

    // Validate required fields before touching the database
    if (!body.title?.trim() || !body.content?.trim() || !body.type) {
      return NextResponse.json(
        { error: 'title, content, and type are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_items')
      .insert([{
        title:      body.title.trim(),
        content:    body.content.trim(),
        type:       body.type,
        tags:       body.tags || [],
        source_url: body.source_url?.trim() || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/knowledge]', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge item' },
      { status: 500 }
    );
  }
}