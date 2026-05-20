'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { posts, comments, nextPostId, nextCommentId, LANGUAGES } from '@/lib/db'
import { getSession } from '@/lib/session'

export type PostState = {
  errors?: {
    title?: string[]
    errorMessage?: string[]
    codeSnippet?: string[]
    language?: string[]
    general?: string[]
  }
} | undefined

// ── Create ────────────────────────────────────────────────────────────────────

export async function createPost(
  _state: PostState,
  formData: FormData
): Promise<PostState> {
  const session = await getSession()
  if (!session) return { errors: { general: ['You must be logged in.'] } }

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const errorMessage = (formData.get('errorMessage') as string | null)?.trim() ?? ''
  const codeSnippet = (formData.get('codeSnippet') as string | null) ?? ''
  const language = (formData.get('language') as string | null)?.trim() ?? ''

  const errors: NonNullable<PostState>['errors'] = {}
  if (title.length < 3) errors.title = ['Title must be at least 3 characters.']
  if (errorMessage.length < 5) errors.errorMessage = ['Error message must be at least 5 characters.']
  if (!LANGUAGES.includes(language as (typeof LANGUAGES)[number])) {
    errors.language = ['Please select a programming language.']
  }
  if (Object.keys(errors).length > 0) return { errors }

  const id = nextPostId()
  posts.set(id, {
    id,
    title,
    errorMessage,
    codeSnippet,
    language,
    authorId: session.id,
    authorName: session.username,
    resolved: false,
    likes: [],
    createdAt: Date.now(),
  })

  revalidatePath('/board')
  redirect(`/post/${id}`)
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updatePost(
  postId: string,
  _state: PostState,
  formData: FormData
): Promise<PostState> {
  const session = await getSession()
  if (!session) return { errors: { general: ['You must be logged in.'] } }

  const post = posts.get(postId)
  if (!post) return { errors: { general: ['Post not found.'] } }
  if (post.authorId !== session.id) return { errors: { general: ['Not authorised.'] } }

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const errorMessage = (formData.get('errorMessage') as string | null)?.trim() ?? ''
  const codeSnippet = (formData.get('codeSnippet') as string | null) ?? ''
  const language = (formData.get('language') as string | null)?.trim() ?? ''

  const errors: NonNullable<PostState>['errors'] = {}
  if (title.length < 3) errors.title = ['Title must be at least 3 characters.']
  if (errorMessage.length < 5) errors.errorMessage = ['Error message must be at least 5 characters.']
  if (!LANGUAGES.includes(language as (typeof LANGUAGES)[number])) {
    errors.language = ['Please select a programming language.']
  }
  if (Object.keys(errors).length > 0) return { errors }

  posts.set(postId, { ...post, title, errorMessage, codeSnippet, language })

  revalidatePath(`/post/${postId}`)
  revalidatePath('/board')
  redirect(`/post/${postId}`)
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deletePost(postId: string): Promise<void> {
  const session = await getSession()
  if (!session) redirect('/')

  const post = posts.get(postId)
  if (!post) return
  if (post.authorId !== session.id) return

  posts.delete(postId)
  for (const [cid, c] of comments.entries()) {
    if (c.postId === postId) comments.delete(cid)
  }

  revalidatePath('/board')
  redirect('/board')
}

// ── Resolve / Unresolve ───────────────────────────────────────────────────────

export async function resolvePost(postId: string): Promise<void> {
  const session = await getSession()
  if (!session) redirect('/')

  const post = posts.get(postId)
  if (!post) return
  if (post.authorId !== session.id) return

  posts.set(postId, { ...post, resolved: true })
  revalidatePath(`/post/${postId}`)
  revalidatePath('/board')
}

export async function unresolvePost(postId: string): Promise<void> {
  const session = await getSession()
  if (!session) redirect('/')

  const post = posts.get(postId)
  if (!post) return
  if (post.authorId !== session.id) return

  posts.set(postId, { ...post, resolved: false })
  revalidatePath(`/post/${postId}`)
  revalidatePath('/board')
}

// ── Comments ──────────────────────────────────────────────────────────────────

export type CommentState = {
  errors?: {
    body?: string[]
    general?: string[]
  }
} | undefined

export async function addComment(
  postId: string,
  _state: CommentState,
  formData: FormData
): Promise<CommentState> {
  const session = await getSession()
  if (!session) return { errors: { general: ['You must be logged in.'] } }

  const body = (formData.get('body') as string | null)?.trim() ?? ''
  if (body.length < 1) return { errors: { body: ['Comment cannot be empty.'] } }

  const post = posts.get(postId)
  if (!post) return { errors: { general: ['Post not found.'] } }

  const id = nextCommentId()
  comments.set(id, {
    id,
    postId,
    body,
    authorId: session.id,
    authorName: session.username,
    likes: [],
    createdAt: Date.now(),
  })

  revalidatePath(`/post/${postId}`)
  return undefined
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export async function togglePostLike(postId: string): Promise<void> {
  const session = await getSession()
  if (!session) return

  const post = posts.get(postId)
  if (!post) return

  const liked = (post.likes ?? []).includes(session.id)
  posts.set(postId, {
    ...post,
    likes: liked
      ? (post.likes ?? []).filter((id) => id !== session.id)
      : [...(post.likes ?? []), session.id],
  })
  revalidatePath(`/post/${postId}`)
}

export async function toggleCommentLike(commentId: string, postId: string): Promise<void> {
  const session = await getSession()
  if (!session) return

  const comment = comments.get(commentId)
  if (!comment) return

  const liked = (comment.likes ?? []).includes(session.id)
  comments.set(commentId, {
    ...comment,
    likes: liked
      ? (comment.likes ?? []).filter((id) => id !== session.id)
      : [...(comment.likes ?? []), session.id],
  })
  revalidatePath(`/post/${postId}`)
}
