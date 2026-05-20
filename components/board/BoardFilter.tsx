'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import PostCard from '@/components/board/PostCard'
import type { Post, Comment } from '@/lib/db'
import { LANGUAGES } from '@/lib/db'

type SortMode = 'latest' | 'top' | 'comments'

interface BoardFilterProps {
  posts: Post[]
  commentCounts: Record<string, number>
  likeCounts: Record<string, number>
  allComments: Comment[]
  postTitles: Record<string, string>
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return (
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  )
}

export default function BoardFilter({
  posts,
  commentCounts,
  likeCounts,
  allComments,
  postTitles,
}: BoardFilterProps) {
  const [sort, setSort] = useState<SortMode>('latest')
  const [query, setQuery] = useState('')
  const [langFilter, setLangFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all')

  // ── Sorted + filtered posts (Latest / Top tabs) ───────────────────────────
  const sortedPosts = useMemo(() => {
    const copy = [...posts]
    if (sort === 'latest') {
      copy.sort((a, b) => b.createdAt - a.createdAt)
    } else {
      // top — by likes
      copy.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    }
    return copy
  }, [posts, sort])

  const filteredPosts = useMemo(() => {
    const q = query.toLowerCase()
    return sortedPosts.filter((p) => {
      const matchesQuery =
        !q ||
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.errorMessage ?? '').toLowerCase().includes(q) ||
        (p.authorName ?? '').toLowerCase().includes(q) ||
        (p.language ?? '').toLowerCase().includes(q)
      const matchesLang = !langFilter || (p.language ?? '') === langFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && !p.resolved) ||
        (statusFilter === 'resolved' && p.resolved)
      return matchesQuery && matchesLang && matchesStatus
    })
  }, [sortedPosts, query, langFilter, statusFilter])

  const openPosts = filteredPosts.filter((p) => !p.resolved)
  const resolvedPosts = filteredPosts.filter((p) => p.resolved)

  // ── Filtered comments (Comments tab) ─────────────────────────────────────
  const filteredComments = useMemo(() => {
    const q = query.toLowerCase()
    return allComments.filter((c) =>
      !q ||
      c.body.toLowerCase().includes(q) ||
      c.authorName.toLowerCase().includes(q) ||
      (postTitles[c.postId] ?? '').toLowerCase().includes(q)
    )
  }, [allComments, query, postTitles])

  const SORT_TABS: { key: SortMode; label: string }[] = [
    { key: 'latest', label: 'Latest' },
    { key: 'top', label: 'Top' },
    { key: 'comments', label: 'Comments' },
  ]

  const isCommentsTab = sort === 'comments'
  const resultCount = isCommentsTab ? filteredComments.length : filteredPosts.length
  const resultLabel = isCommentsTab
    ? resultCount === 1 ? '1 comment' : `${resultCount} comments`
    : resultCount === 1 ? '1 post' : `${resultCount} posts`

  return (
    <div className="flex flex-col gap-4">

      {/* Sort tabs + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm border border-slate-200/80">
          {SORT_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                sort === key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400">{resultLabel}</span>
      </div>

      {/* Search + filters — search always visible; language/status hidden on Comments tab */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isCommentsTab
                ? 'Search comments by content, author, post…'
                : 'Search by title, error, author…'
            }
            className="w-full rounded-md border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {/* Language + status — only relevant for posts */}
        {!isCommentsTab && (
          <>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 bg-white"
              aria-label="Filter by language"
            >
              <option value="">All languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <div className="flex rounded-md border border-zinc-300 overflow-hidden text-sm">
              {(['all', 'open', 'resolved'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-zinc-900 text-white'
                      : 'bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Comments tab view ─────────────────────────────────────────────── */}
      {isCommentsTab && (
        <>
          {filteredComments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400">
              No comments yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {filteredComments.map((comment) => (
                <li key={comment.id}>
                  <Link
                    href={`/post/${comment.postId}`}
                    className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                  >
                    {/* Post title it belongs to */}
                    <p className="mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      on:{' '}
                      <span className="text-zinc-600 normal-case font-medium">
                        {postTitles[comment.postId] ?? 'Unknown post'}
                      </span>
                    </p>

                    {/* Comment body */}
                    <p className="text-sm text-zinc-700 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {comment.body}
                    </p>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                      <span className="font-medium text-zinc-500">{comment.authorName}</span>
                      <span>·</span>
                      <span>{formatDate(comment.createdAt)}</span>
                      {(comment.likes?.length ?? 0) > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {comment.likes.length}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* ── Posts tab view (Latest / Top) ─────────────────────────────────── */}
      {!isCommentsTab && (
        <>
          {filteredPosts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400">
              No posts match your search.
            </p>
          ) : (
            <>
              {(statusFilter === 'all' || statusFilter === 'open') && openPosts.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Open · {openPosts.length}
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {openPosts.map((post) => (
                      <li key={post.id}>
                        <PostCard
                          post={post}
                          commentCount={commentCounts[post.id] ?? 0}
                          likeCount={likeCounts[post.id] ?? 0}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(statusFilter === 'all' || statusFilter === 'resolved') && resolvedPosts.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Resolved · {resolvedPosts.length}
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {resolvedPosts.map((post) => (
                      <li key={post.id}>
                        <PostCard
                          post={post}
                          commentCount={commentCounts[post.id] ?? 0}
                          likeCount={likeCounts[post.id] ?? 0}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
