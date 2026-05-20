'use server'

import { redirect } from 'next/navigation'
import { users, nextUserId } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/crypto'
import { createSession, deleteSession } from '@/lib/session'

export type AuthState = {
  errors?: {
    username?: string[]
    password?: string[]
    general?: string[]
  }
} | undefined

export async function signup(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get('username') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  const errors: NonNullable<AuthState>['errors'] = {}

  if (username.length < 2) {
    errors.username = ['Username must be at least 2 characters.']
  }
  if (password.length < 6) {
    errors.password = ['Password must be at least 6 characters.']
  }
  if (Object.keys(errors).length > 0) return { errors }

  // Check for duplicate username
  for (const u of users.values()) {
    if (u.username.toLowerCase() === username.toLowerCase()) {
      return { errors: { username: ['That username is already taken.'] } }
    }
  }

  const id = nextUserId()
  const passwordHash = hashPassword(password)
  users.set(id, { id, username, passwordHash, createdAt: Date.now() })

  await createSession(id)
  redirect('/board')
}

export async function login(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get('username') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  let found = null
  for (const u of users.values()) {
    if (u.username.toLowerCase() === username.toLowerCase()) {
      found = u
      break
    }
  }

  if (!found || !verifyPassword(password, found.passwordHash)) {
    return { errors: { general: ['Invalid username or password.'] } }
  }

  await createSession(found.id)
  redirect('/board')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/')
}
