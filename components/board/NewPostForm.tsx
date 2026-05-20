'use client'

import { useActionState } from 'react'
import { createPost } from '@/lib/actions/posts'
import { LANGUAGES } from '@/lib/db'
import SubmitButton from '@/components/ui/SubmitButton'

export default function NewPostForm() {
  const [state, action] = useActionState(createPost, undefined)

  return (
    <form action={action} className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Post a question</h2>

      {state?.errors?.general && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {state.errors.general[0]}
        </p>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="What are you stuck on?"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        {state?.errors?.title && (
          <p className="text-xs text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1">
        <label htmlFor="language" className="text-sm font-medium text-zinc-700">
          Language <span className="text-red-500">*</span>
        </label>
        <select
          id="language"
          name="language"
          required
          defaultValue=""
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 bg-white"
        >
          <option value="" disabled>Select a language…</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        {state?.errors?.language && (
          <p className="text-xs text-red-600">{state.errors.language[0]}</p>
        )}
      </div>

      {/* Error message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="errorMessage" className="text-sm font-medium text-zinc-700">
          Error message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="errorMessage"
          name="errorMessage"
          rows={2}
          placeholder="Paste the exact error message you're seeing…"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y"
        />
        {state?.errors?.errorMessage && (
          <p className="text-xs text-red-600">{state.errors.errorMessage[0]}</p>
        )}
      </div>

      {/* Code snippet */}
      <div className="flex flex-col gap-1">
        <label htmlFor="codeSnippet" className="text-sm font-medium text-zinc-700">
          Code snippet <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="codeSnippet"
          name="codeSnippet"
          rows={5}
          placeholder="Paste the relevant code here…"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y"
        />
      </div>

      <SubmitButton
        label="Post question"
        pendingLabel="Posting…"
        className="self-end bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-500"
      />
    </form>
  )
}
