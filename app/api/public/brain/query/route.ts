import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

// GET /api/public/brain/query?q=your+question
//
// Public REST API endpoint — no authentication required.
// Allows external tools, bots, or integrations to query the knowledge base.
// This is the endpoint linked from the Navbar API button.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('q');

  if (!question?.trim()) {
    return NextResponse.json(
      {
        error: 'Missing required query parameter',
        usage: 'GET /api/public/brain/query?q=your+question',
        example: '/api/public/brain/query?q=What+do+I+know+about+AI',
      },
      { status: 400 }
    );
  }

  try {
    // Fetch all knowledge items to serve as Claude context
    const { data: items, error: dbError } = await supabase
      .from('knowledge_items')
      .select('*');

    if (dbError) {
      console.error('[GET /api/public/brain/query] Supabase error:', dbError);
      return NextResponse.json(
        {
          error: 'Database error: ' + dbError.message,
          hint: 'Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
        },
        { status: 500 }
      );
    }

    // Handle empty knowledge base without hitting Claude
    if (!items || items.length === 0) {
      return NextResponse.json({
        question,
        answer: 'The knowledge base is currently empty. Add some items via the dashboard first.',
        sources: [],
        meta: {
          total_items_queried: 0,
          timestamp: new Date().toISOString(),
          powered_by: 'Claude AI (Anthropic)',
        },
      });
    }

    const result = await queryKnowledgeBase(question, items);

    return NextResponse.json(
      {
        question,
        ...result,
        meta: {
          total_items_queried: items.length,
          timestamp: new Date().toISOString(),
          powered_by: 'Claude AI (Anthropic)',
        },
      },
      {
        headers: {
          // Cache for 60 seconds on Vercel Edge Network
          'Cache-Control': 's-maxage=60, stale-while-revalidate',
        },
      }
    );
  } catch (err: unknown) {
    console.error('[GET /api/public/brain/query] Error:', err);

    const message = err instanceof Error ? err.message : String(err);

    let hint = 'Check the terminal for the full error.';
    if (message.includes('401') || message.includes('auth')) {
      hint = 'ANTHROPIC_API_KEY is invalid. Check .env.local and restart the server.';
    } else if (message.includes('credit') || message.includes('529')) {
      hint = 'No Anthropic credits. Add billing at console.anthropic.com.';
    }

    return NextResponse.json(
      { error: message, hint },
      { status: 500 }
    );
  }
}