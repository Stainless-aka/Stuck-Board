'use client'

import { useTransition } from 'react'
import { togglePostLike, toggleCommentLike } from '@/lib/actions/posts'

interface PostLikeButtonProps {
  postId: string
  likeCount: number
  liked: boolean
}

export function PostLikeButton({ postId, likeCount, liked }: PostLikeButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => togglePostLike(postId))}
      disabled={isPending}
      aria-label={liked ? 'Unlike post' : 'Like post'}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400'
          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 focus-visible:ring-zinc-400'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likeCount}</span>
    </button>
  )
}

interface CommentLikeButtonProps {
  commentId: string
  postId: string
  likeCount: number
  liked: boolean
}

export function CommentLikeButton({ commentId, postId, likeCount, liked }: CommentLikeButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleCommentLike(commentId, postId))}
      disabled={isPending}
      aria-label={liked ? 'Unlike comment' : 'Like comment'}
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 ${
        liked
          ? 'text-red-500 hover:text-red-600'
          : 'text-zinc-400 hover:text-zinc-600'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likeCount}</span>
    </button>
  )
}
