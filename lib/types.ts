// This file is the single source of truth for all TypeScript types.
// By defining them once here, both the frontend and API routes share
// the exact same type definitions — no duplication, no mismatches.

export type KnowledgeType = 'note' | 'link' | 'insight';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: KnowledgeType;
  tags: string[];
  source_url?: string | null;
  summary?: string | null;   // Populated by AI after user requests it
  ai_tags?: string[];        // Separate from user tags — AI generates these
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeInput {
  title: string;
  content: string;
  type: KnowledgeType;
  tags?: string[];
  source_url?: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    relevance: string;
  }>;
}