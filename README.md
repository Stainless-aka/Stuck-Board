# Stuck Board

A developer discussion board for posting and solving programming errors. When you're stuck on a bug, paste your error message and code snippet, and let the community help you get unstuck.

---

## What it does

Stuck Board is a focused Q&A board built around a single workflow: **post your error → get answers → mark it resolved.**

### Feed (Board)

- Browse all posts sorted by **Latest**, **Top** (most liked), or switch to the **Comments** tab to see a flat feed of every comment across all posts
- Filter by **programming language**, **status** (open / resolved), or **search** by title, error message, or author
- Each post card shows the title, language badge, error message snippet, author, date/time, comment count, and like count

### Posting a question

Every post captures:
- **Title** — a short description of what you're stuck on
- **Language** — the programming language or tool involved
- **Error message** — the exact error output, displayed in a red monospace block
- **Code snippet** — optional, rendered in a dark code block with the language label

### Post detail

- Full error message and code snippet displayed in styled blocks
- **Like** the post if you found it helpful
- **Comments** with per-comment likes, author, and timestamp
- Post authors can **edit**, **delete**, or **mark as resolved / unresolved**

### Auth

- Sign up with a username and password
- Sessions are stored in a secure, signed HTTP-only cookie
- Passwords are hashed with `scrypt`

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Custom — `scrypt` password hashing, HMAC-signed session cookies |
| Data | In-memory store (survives hot reloads via `globalThis`) |
| Runtime | Node.js |

> **Note:** Data is stored in memory and resets on server restart. To persist data across restarts, swap the in-memory store in `lib/db.ts` for a database (SQLite, Postgres, etc.).

---

## Project structure

```
app/
  page.tsx              # Login
  signup/               # Sign up
  board/                # Feed with sort, filter, search
  post/[id]/            # Post detail
  post/[id]/edit/       # Edit post

components/
  auth/                 # LoginForm, SignupForm
  board/                # PostCard, NewPostForm, BoardFilter, LogoutButton
  post/                 # CommentForm, EditPostForm, DeletePostButton,
                        # ResolveButton, LikeButton
  ui/                   # SubmitButton

lib/
  db.ts                 # In-memory data store + types
  session.ts            # Cookie session management
  crypto.ts             # Password hashing + token signing
  actions/
    auth.ts             # signup, login, logout
    posts.ts            # createPost, updatePost, deletePost,
                        # resolvePost, addComment, togglePostLike,
                        # toggleCommentLike
```

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start posting.
