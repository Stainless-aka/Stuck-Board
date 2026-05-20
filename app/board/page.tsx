import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { posts, comments } from '@/lib/db'
import BoardFilter from '@/components/board/BoardFilter'
import NewPostForm from '@/components/board/NewPostForm'
import LogoutButton from '@/components/board/LogoutButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Board — Stuck Board',
}

export default async function BoardPage() {
  const session = await getSession()
  if (!session) redirect('/')

  // Posts — unsorted, BoardFilter handles sorting client-side
  const allPosts = Array.from(posts.values())

  // Comment counts per post (for sort + card display)
  const commentCounts: Record<string, number> = {}
  for (const c of comments.values()) {
    commentCounts[c.postId] = (commentCounts[c.postId] ?? 0) + 1
  }

  // Like counts per post
  const likeCounts: Record<string, number> = {}
  for (const p of posts.values()) {
    likeCounts[p.id] = p.likes?.length ?? 0
  }

  // All comments newest-first for the Comments tab
  const allComments = Array.from(comments.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  )

  // postId → post title so comments can link back to their post
  const postTitles: Record<string, string> = {}
  for (const p of posts.values()) {
    postTitles[p.id] = p.title ?? 'Untitled'
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none">Stuck Board</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Discussion</span>
            </div>
          </div>

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

      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8 flex flex-col gap-6">
        <NewPostForm />
        <BoardFilter
          posts={allPosts}
          commentCounts={commentCounts}
          likeCounts={likeCounts}
          allComments={allComments}
          postTitles={postTitles}
        />
      </main>
    </div>
  )
}
