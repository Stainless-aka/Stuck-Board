'use client'

import { useActionState } from 'react'
import { updatePost } from '@/lib/actions/posts'
import { LANGUAGES } from '@/lib/db'
import SubmitButton from '@/components/ui/SubmitButton'
import Link from 'next/link'

interface EditPostFormProps {
  post: {
    id: string
    title: string
    language: string
    errorMessage: string
    codeSnippet: string
  }
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const boundAction = updatePost.bind(null, post.id)
  const [state, action] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.errors?.general && (
        <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {state.errors.general[0]}
        </p>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post.title}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950"
          placeholder="What issue are you experiencing?"
        />
        {state?.errors?.title && (
          <p className="text-xs text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="language" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Language <span className="text-red-500">*</span>
        </label>
        <select
          id="language"
          name="language"
          required
          defaultValue={post.language}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none bg-white"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        {state?.errors?.language && (
          <p className="text-xs text-red-600">{state.errors.language[0]}</p>
        )}
      </div>

      {/* Error message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="errorMessage" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Error message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="errorMessage"
          name="errorMessage"
          required
          rows={3}
          defaultValue={post.errorMessage}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 font-mono text-xs text-rose-700 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 resize-y"
          placeholder="Paste the exact error message…"
        />
        {state?.errors?.errorMessage && (
          <p className="text-xs text-red-600">{state.errors.errorMessage[0]}</p>
        )}
      </div>

      {/* Code snippet */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="codeSnippet" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Code snippet <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="codeSnippet"
          name="codeSnippet"
          rows={6}
          defaultValue={post.codeSnippet}
          className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-800 resize-y"
          placeholder="// Paste the relevant code here…"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Link
          href={`/post/${post.id}`}
          className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 flex items-center"
        >
          Discard
        </Link>
        <SubmitButton
          label="Save changes"
          pendingLabel="Saving…"
          className="bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500"
        />
      </div>
    </form>
  )
}
