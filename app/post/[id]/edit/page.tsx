import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { posts } from '@/lib/db'
import EditPostForm from '@/components/post/EditPostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit post — Stuck Board',
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/')

  const { id } = await params
  const post = posts.get(id)
  if (!post) notFound()

  // Only the author can edit
  if (post.authorId !== session.id) redirect(`/post/${id}`)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <Link
            href={`/post/${id}`}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg px-2.5 py-1.5 hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to post
          </Link>
          <span className="text-sm font-semibold text-slate-900">Edit post</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-lg font-bold text-slate-900">Edit post</h1>
          <EditPostForm
            post={{
              id: post.id,
              title: post.title,
              language: post.language ?? '',
              errorMessage: post.errorMessage ?? '',
              codeSnippet: post.codeSnippet ?? '',
            }}
          />
        </div>
      </main>
    </div>
  )
}
