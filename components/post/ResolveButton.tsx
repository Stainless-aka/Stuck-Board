'use client'

import { useTransition } from 'react'
import { resolvePost, unresolvePost } from '@/lib/actions/posts'

interface ResolveButtonProps {
  postId: string
  resolved: boolean
}

export default function ResolveButton({ postId, resolved }: ResolveButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      if (resolved) {
        await unresolvePost(postId)
      } else {
        await resolvePost(postId)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        resolved
          ? 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus-visible:ring-zinc-400'
          : 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500'
      }`}
    >
      {isPending ? '…' : resolved ? 'Mark as unresolved' : 'Mark as resolved'}
    </button>
  )
}
