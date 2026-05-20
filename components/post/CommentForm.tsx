'use client'

import { useActionState } from 'react'
import { addComment } from '@/lib/actions/posts'
import SubmitButton from '@/components/ui/SubmitButton'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const boundAction = addComment.bind(null, postId)
  const [state, action] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="flex flex-col gap-3">
      {state?.errors?.general && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {state.errors.general[0]}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="body"
          name="body"
          rows={3}
          placeholder="Add a comment or answer…"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y"
        />
        {state?.errors?.body && (
          <p className="text-xs text-red-600">{state.errors.body[0]}</p>
        )}
      </div>

      <SubmitButton
        label="Post comment"
        pendingLabel="Posting…"
        className="self-end bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-500"
      />
    </form>
  )
}
