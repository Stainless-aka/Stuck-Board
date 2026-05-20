import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SESSION_SECRET = process.env.SESSION_SECRET ?? 'stuck-board-dev-secret-change-in-prod'

// ── Password hashing ──────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const derived = scryptSync(password, salt, 64)
  const storedBuf = Buffer.from(hash, 'hex')
  return timingSafeEqual(derived, storedBuf)
}

// ── Session tokens (HMAC-signed) ──────────────────────────────────────────────

function sign(payload: string): string {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
}

export function createToken(userId: string): string {
  const payload = `${userId}.${Date.now()}`
  const sig = sign(payload)
  return Buffer.from(`${payload}.${sig}`).toString('base64url')
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const lastDot = decoded.lastIndexOf('.')
    const payload = decoded.slice(0, lastDot)
    const sig = decoded.slice(lastDot + 1)
    const expected = sign(payload)
    const sigBuf = Buffer.from(sig, 'hex')
    const expectedBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expectedBuf.length) return null
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null
    // payload is "userId.timestamp"
    const userId = payload.split('.')[0]
    return userId
  } catch {
    return null
  }
}
