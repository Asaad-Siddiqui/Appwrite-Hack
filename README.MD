# DevOverflow - Full Appwrite & Next.js 16 Migration

This repository contains DevOverflow, completely migrated from Clerk + MongoDB/Mongoose to **Appwrite Cloud (TablesDB + Appwrite Auth + Appwrite Storage)** and upgraded to **Next.js 16 (Latest: 16.4.3)**.

---

## 🚀 Key Migration Highlights

1. **Next.js 16 Upgrade**:
   - Upgraded core framework to `next@16.4.3` (Turbopack).
   - Modernized server component params handling (`await params` / `await searchParams`).
   - Cleaned PostCSS imports and Next.js configuration.
   - Verified production build compiles cleanly with zero errors.

2. **Complete Auth Migration (Clerk ➡️ Appwrite Auth)**:
   - Completely uninstalled and purged `@clerk/nextjs`.
   - Built a native Appwrite Authentication system with:
     - Full session management using secure, HTTP-only SSR cookies (`appwrite-session`).
     - Appwrite Client & Server SDK integration (`node-appwrite` and `appwrite`).
     - Global `AuthProvider`, `useAuth()`, `<SignedIn>`, `<SignedOut>`, and `<UserButton>` components with drop-in compatibility.
     - Custom, responsive `/sign-in` and `/sign-up` forms.
     - Cookie-based authentication middleware.

3. **Complete Database Migration (MongoDB/Mongoose ➡️ Appwrite TablesDB)**:
   - Completely uninstalled and removed `mongoose` and `mongodb`.
   - Managed under Appwrite database **"Production TablesDB"** (`6adcb48000343a1edbc5`).
   - Created all 5 relational tables via Appwrite MCP / API:
     - `users`: User profiles, reputation, saved questions, bio, portfolio.
     - `questions`: Title, content, author, views, upvotes, downvotes, answers array.
     - `answers`: Author, question reference, content, votes, timestamps.
     - `tags`: Tag metadata, associated question IDs, followers.
     - `interactions`: User actions, views, votes, question interactions.
   - Built indexes across all queryable attributes (`idx_users_account`, `idx_users_clerk`, `idx_users_email`, `idx_questions_author`, `idx_answers_question`, `idx_tags_name`, etc.).
   - Initialized `devoverflow-storage` bucket with public read access.

---

## 🛠️ Appwrite Configuration & Credentials

Configured in `stack_overflow_nextjs14/.env.local`:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=6adcb0d2002b03e62588
APPWRITE_API_KEY=standard_d37a2f180d330a5ecf9a4a12282082d10173fa33ddfb0acfbe50acfa1ee79a73fd249b53f316bd10049dd8a05dfde24bca568fecac57459884e1e4b8e8783e81aa89a625248dd35f09016279a079e6b1fefc80e1403ba9e3f3ea75cc4f37c047e377c22e67f3398330a7260ab416f38139daa85104e14e05d69d87d89a077df9
APPWRITE_DATABASE_ID=6adcb48000343a1edbc5
NEXT_PUBLIC_APPWRITE_DATABASE_ID=6adcb48000343a1edbc5
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## 📡 MCP Server Status & Verification

1. **Remote MCP (`https://mcp.appwrite.io`)**:
   - Connection tested: Returns `HTTP 401 Unauthorized` (`invalid_token: Authentication required`).
   - Root cause: `https://mcp.appwrite.io` is Appwrite Cloud's hosted remote MCP endpoint that requires interactive OAuth 2.1 browser flow.
2. **Local Stdio MCP (`uvx mcp-server-appwrite`)**:
   - Successfully initialized using project credentials (`APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `APPWRITE_ENDPOINT`).
   - Successfully inspected project `Appwrite Hack` (`6adcb0d2002b03e62588`) in region `sgp`.
   - Successfully inspected database `Production TablesDB` (`6adcb48000343a1edbc5`).
   - Note on scopes: The project API key has `tablesdb` and `users` scopes, allowing full table and row manipulation, while legacy `collections.read` (DocumentsDB) is intentionally not scoped.

---

## 🏃 Getting Started

```bash
cd stack_overflow_nextjs14

# Install dependencies
npm install --legacy-peer-deps

# Build the project (Next.js 16 Turbopack)
npm run build

# Start the production server
npm run start
```
Server runs on [http://localhost:3000](http://localhost:3000).
