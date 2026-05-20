import Link from 'next/link'
import type { Post } from '@/lib/db'

interface PostCardProps {
  post: Post
  commentCount: number
  likeCount: number
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    + ' at '
    + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function PostCard({ post, commentCount, likeCount }: PostCardProps) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
    >
      {/* Top row: title + resolved badge */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 leading-snug">
          {post.title}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {/* Language badge */}
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {post.language ?? 'Unknown'}
          </span>
          {post.resolved && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Resolved
            </span>
          )}
        </div>
      </div>

      {/* Error message snippet */}
      <p className="mt-2 line-clamp-1 text-xs font-mono text-red-600 bg-red-50 rounded px-2 py-1">
        {post.errorMessage ?? <span className="italic text-zinc-400">No error message</span>}
      </p>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
        <span className="font-medium text-zinc-500">{post.authorName}</span>
        <span>·</span>
        <span>{formatDate(post.createdAt)}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          {/* comment icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {commentCount}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          {/* heart icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likeCount}
        </span>
      </div>
    </Link>
  )
}
