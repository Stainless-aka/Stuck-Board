import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { posts, comments } from '@/lib/db'
import CommentForm from '@/components/post/CommentForm'
import ResolveButton from '@/components/post/ResolveButton'
import DeletePostButton from '@/components/post/DeletePostButton' // Extracted client component
import { PostLikeButton, CommentLikeButton } from '@/components/post/LikeButton'
import LogoutButton from '@/components/board/LogoutButton'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = posts.get(id)
  return { title: post ? `${post.title} — Stuck Board` : 'Post — Stuck Board' }
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    + ' at '
    + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/')

  const { id } = await params
  const post = posts.get(id)
  if (!post) notFound()

  const postComments = Array.from(comments.values())
    .filter((c) => c.postId === id)
    .sort((a, b) => a.createdAt - b.createdAt)

  const postLikes: string[] = post.likes ?? []
  const isAuthor = session.id === post.authorId
  const postLiked = postLikes.includes(session.id)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-slate-200">
      
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          {/* Back to Board Navigation */}
          <Link
            href="/board"
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg px-2.5 py-1.5 hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Board
          </Link>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                {session.username.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{session.username}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8 flex flex-col gap-6">

        {/* Post Card */}
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 overflow-hidden">

          {/* Card Top Header Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex flex-col gap-4">
              
              {/* Badges and Interactive Control Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tracking-wide uppercase text-[10px]">
                    {post.language}
                  </span>
                  {post.resolved && (
                    <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 text-[10px] tracking-wide uppercase">
                      Resolved
                    </span>
                  )}
                </div>

                {/* Author Options Toolbar */}
                {isAuthor && (
                  <div className="flex items-center gap-1.5">
                    <ResolveButton postId={post.id} resolved={post.resolved} />
                    
                    {/* Modern Edit Action Link */}
                    <Link
                      href={`/post/${post.id}/edit`}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>

                    {/* Extracted client component injection site */}
                    <DeletePostButton postId={post.id} />
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {post.title}
                </h1>
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">{post.authorName}</span>
                  <span>·</span>
                  <span>{formatDate(post.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Error Message Box */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-500 text-[10px]">
              Error Message
            </p>
            <div className="rounded-xl bg-rose-50/60 border border-rose-100 px-4 py-3 shadow-inner shadow-rose-100/10">
              <p className="text-sm font-mono text-rose-800 whitespace-pre-wrap break-all leading-relaxed">
                {post.errorMessage}
              </p>
            </div>
          </div>

          {/* Code Snippet */}
          {post.codeSnippet && (
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-[10px]">
                  Code Snippet
                </p>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">
                  {post.language}
                </span>
              </div>
              <div className="rounded-xl bg-slate-950 shadow-lg shadow-slate-950/10 overflow-x-auto ring-1 ring-white/10">
                <pre className="px-4 py-4 text-xs sm:text-sm text-slate-100 font-mono leading-relaxed whitespace-pre">
                  <code>{post.codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Card Footer: Likes */}
          <div className="px-6 py-3.5 bg-slate-50/30 flex items-center gap-3">
            <PostLikeButton
              postId={post.id}
              likeCount={postLikes.length}
              liked={postLiked}
            />
            <span className="text-xs font-medium text-slate-400">
              {postLikes.length === 1 ? '1 person found this helpful' : `${postLikes.length} people found this helpful`}
            </span>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-[10px]">
              Discussion ({postComments.length})
            </h2>
          </div>

          {postComments.length > 0 && (
            <ul className="flex flex-col gap-3 mb-6">
              {postComments.map((comment, index) => {
                const commentLikes: string[] = comment.likes ?? []
                const commentLiked = commentLikes.includes(session.id)
                return (
                  <li
                    key={comment.id}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all"
                  >
                    <p className="px-5 pt-4 pb-3">
                      <span className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {comment.body}
                      </span>
                    </p>
                    <div className="px-5 pb-3.5 flex items-center justify-between border-t border-slate-50 pt-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-600">{comment.authorName}</span>
                        <span>·</span>
                        <span>{formatDate(comment.createdAt)}</span>
                        <span>·</span>
                        <span className="font-mono bg-slate-100 text-slate-500 rounded px-1 text-[10px]">#{index + 1}</span>
                      </div>
                      <CommentLikeButton
                        commentId={comment.id}
                        postId={post.id}
                        likeCount={commentLikes.length}
                        liked={commentLiked}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Comment Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Leave a comment</h3>
              <p className="text-xs text-slate-400">Contribute an answer or suggest a solution.</p>
            </div>
            <CommentForm postId={post.id} />
          </div>
        </section>
      </main>
    </div>
  )
}