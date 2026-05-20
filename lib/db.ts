// In-memory data store.
// Uses globalThis to survive Next.js hot-module reloads in development,
// so data persists across file saves without restarting the server.

export interface User {
  id: string
  username: string
  passwordHash: string
  createdAt: number
}

export interface Post {
  id: string
  title: string
  errorMessage: string
  codeSnippet: string
  language: string
  authorId: string
  authorName: string
  resolved: boolean
  likes: string[] // array of userIds
  createdAt: number
}

export interface Comment {
  id: string
  postId: string
  body: string
  authorId: string
  authorName: string
  likes: string[] // array of userIds
  createdAt: number
}

// Attach to globalThis so the Maps survive HMR re-evaluation of this module.
const g = globalThis as typeof globalThis & {
  __sb_users?: Map<string, User>
  __sb_posts?: Map<string, Post>
  __sb_comments?: Map<string, Comment>
  __sb_userSeq?: number
  __sb_postSeq?: number
  __sb_commentSeq?: number
}

g.__sb_users ??= new Map<string, User>()
g.__sb_posts ??= new Map<string, Post>()
g.__sb_comments ??= new Map<string, Comment>()
g.__sb_userSeq ??= 0
g.__sb_postSeq ??= 0
g.__sb_commentSeq ??= 0

export const users = g.__sb_users
export const posts = g.__sb_posts
export const comments = g.__sb_comments

export function nextUserId(): string {
  return String(++g.__sb_userSeq!)
}
export function nextPostId(): string {
  return String(++g.__sb_postSeq!)
}
export function nextCommentId(): string {
  return String(++g.__sb_commentSeq!)
}

export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'HTML/CSS',
  'SQL',
  'Bash',
  'Other',
] as const

export type Language = (typeof LANGUAGES)[number]
