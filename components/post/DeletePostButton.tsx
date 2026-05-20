'use client'

import { useTransition } from 'react'
import { deletePost } from '@/lib/actions/posts'

interface DeletePostButtonProps {
  postId: string
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    startTransition(() => deletePost(postId))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:pointer-events-none disabled:opacity-50"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
