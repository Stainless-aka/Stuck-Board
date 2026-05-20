import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">404</h1>
      <p className="mt-2 text-zinc-500">That page doesn&apos;t exist.</p>
      <Link
        href="/board"
        className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
      >
        Back to board
      </Link>
    </main>
  )
}
