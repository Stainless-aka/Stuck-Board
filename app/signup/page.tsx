import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import SignupForm from '@/components/auth/SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign up — Stuck Board',
}

export default async function SignupPage() {
  const session = await getSession()
  if (session) redirect('/board')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create an account</h1>
          <p className="mt-1 text-sm text-zinc-500">Join Stuck Board and start asking questions.</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
