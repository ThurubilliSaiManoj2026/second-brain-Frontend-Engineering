// Skeleton loader shown while data is being fetched from Supabase.
// The layout intentionally mirrors the real KnowledgeCard dimensions
// so there is zero layout shift when real cards replace the skeletons.
export default function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-14 rounded-md bg-zinc-800" />
      </div>
      <div className="h-5 w-3/4 rounded-md bg-zinc-800 mb-2" />
      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full rounded bg-zinc-800" />
        <div className="h-3 w-5/6 rounded bg-zinc-800" />
        <div className="h-3 w-4/6 rounded bg-zinc-800" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-14 rounded-md bg-zinc-800" />
        <div className="h-5 w-16 rounded-md bg-zinc-800" />
      </div>
      <div className="h-3.5 w-28 rounded bg-zinc-800" />
    </div>
  );
}