'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'
import Link from 'next/link'

export default function LoginForm() {
  const [state, action] = useActionState(login, undefined)

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.errors?.general && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {state.errors.general[0]}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-zinc-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <SubmitButton
        label="Log in"
        pendingLabel="Logging in…"
        className="bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-500"
      />

      <p className="text-center text-sm text-zinc-500">
        No account?{' '}
        <Link href="/signup" className="font-medium text-zinc-900 underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </form>
  )
}
