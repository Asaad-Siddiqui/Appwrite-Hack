# LendLoop — Neighbourhood Tool Library

**One-sentence pitch:** Borrow tools from neighbours, return them on time, and
see overdues at a glance — a shared shed for one neighbourhood, instead of
everyone buying a tool they will use twice.

Appwrite Databases Hackathon entry. Solo build, 2026.

## The problem, and who it serves

A drill, a ladder, a pressure washer: expensive, bulky, used a few times a
year. In most neighbourhoods they sit in garages while the neighbour two
doors down buys the same thing. LendLoop serves one neighbourhood — the
people who own tools, the people who need them for a weekend job, and the
person keeping track of what is out, what is due, and what is overdue.

## The one complete flow (demo script)

1. **Home** — live stats from TablesDB: tools listed, available now,
   active loans, overdue count.
2. **Browse tools** — filter by category and status, search by name.
3. **Item detail** — owner, condition, description, current loan state.
   Pick a demo member, click **Borrow for 7 days**: a loan row is created,
   the item becomes `borrowed`, and the due date is set to now + 7 days.
4. **My loans** — switch demo member, see their loans, return one:
   the loan becomes `returned` with a return date, and the item goes back
   to `available` (or to `reserved` if someone reserved it).
5. **Overdue** — every active loan past its due date, sorted by due date,
   with days overdue. Overdue is *computed*, not stored as a label:
   `status = active AND dueAt < now`.
6. **Reserve** — on a borrowed/reserved tool, reserve it; when it is
   returned, that reservation is fulfilled and the item becomes reserved.

Try it with the seed data: Rahul's drill loan is overdue (due 17 Oct 2026),
Ananya's ladder loan is due soon (25 Oct 2026), Priya's pressure-washer
loan is normal (30 Oct 2026).

## Architecture

- **Frontend:** Next.js 14, App Router, TypeScript, plain CSS (no Tailwind,
  so the build works offline). All pages are in `app/`, the data layer is
  in `lib/appwrite.ts`.
- **Database (the deliberate Appwrite choice):** Appwrite **TablesDB**,
  database `lendloop`, serverless/free, on Appwrite Cloud (Singapore).
- **Auth:** Appwrite anonymous Auth sessions in the browser for writes.
  There is no real login in this demo — the member picker is clearly
  labelled “demo member”, not real identity verification.

### Tables

| Table | Columns | Purpose |
|---|---|---|
| `members` | name (string 200, required), neighbourhood (string 200, required), phone (string 50, optional) | Who lives in the library |
| `items` | ownerMemberId (string 64), name (200), category (100), condition (50), description (1000, optional), status (50: available/borrowed/reserved) | Tools on offer |
| `loans` | itemId (64), borrowerMemberId (64), ownerMemberId (64), borrowedAt (datetime), dueAt (datetime), returnedAt (datetime, optional), status (50: active/returned) | Borrow history and due dates |
| `reservations` | itemId (64), memberId (64), reservedAt (datetime), status (50: active/fulfilled/cancelled) | Who is next in line |

### Why TablesDB is deliberate (not decorative)

- **Typed columns** enforce the shape that matters: a loan cannot exist
  without an item, a borrower, and a due date.
- **Native relationships** exist on `loans`: `loans.item → items`
  (manyToOne) and `loans.borrower → members` (manyToOne), both with
  `onDelete: setNull`. The app also keeps plain foreign-key columns
  (`itemId`, `borrowerMemberId`) and joins in code, so reads stay simple
  and deterministic — the relationship columns are real and documented,
  not claimed as the only join path.
- **Indexes** (all created, all available): items on `status`, `category`,
  `ownerMemberId`; loans on `itemId`, `borrowerMemberId`, `status`,
  `dueAt`; reservations on `itemId`, `memberId`. These are exactly the
  fields the browse, my-loans, and overdue queries filter on.
- **Permissions:** every table allows `read("any")` and
  `create/update/delete` for `"users"` **and `"guests"`**. The guests
  part is not cosmetic: in this Appwrite version an anonymous session
  counts as role `guests`, not `users` — a users-only table rejected
  writes with `Missing "create" permission for role "users"`, and the
  permissions were fixed to include guests after that exact error.
  That means demo writes are open to anyone with the app open; see
  Honest limits below. Reads are public by design for a neighbourhood
  library catalogue.
- **Overdue is a query + computation, not a stored lie:** the app lists
  active loans and flags `dueAt < now`. No row is ever hand-marked
  “overdue”.

## How to run locally

```bash
cd lendloop
npm install
npm run dev
# open http://localhost:3000
```

The app's public config defaults to the demo project's endpoint, project
ID, and database ID (these are public config, not secrets). To point it
at your own project, copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your project id>
NEXT_PUBLIC_APPWRITE_DATABASE_ID=lendloop
```

Production check:

```bash
npm run build
npm run start
```

## How to set up your own Appwrite project

1. Create a TablesDB database called `lendloop` (serverless).
2. Create the four tables above with the columns, the two native
   relationships on `loans`, the nine indexes, and the permissions above.
   (TablesDB update uses PUT, not PATCH, on the table endpoint.)
3. Run the seed script with a server API key in your environment only
   (never commit it):

```bash
APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1 \
APPWRITE_PROJECT_ID=<your project id> \
APPWRITE_API_KEY=<your server key, never committed> \
node scripts/seed.mjs
```

The seed creates 3 fictional members, 10 items, 3 active loans
(1 overdue, 1 due soon, 1 normal), and 2 reservations. All names,
neighbourhoods, and phone numbers are fictional demo data.

## Honest limits

- **Demo member picker, not real auth.** Anyone opening the app can
  borrow as any demo member. Real identity verification, member
  approval, and damage deposits are not built.
- **Writes are open to guests** (see Permissions above) so the demo
  works without a login. For a real neighbourhood this would need
  member-only writes and row-level ownership checks.
- **No payments, no fines, no notifications.** Overdue is shown, not
  enforced or charged. No SMS/email reminders are sent.
- **No real people.** Every member, phone number, and tool in the seed
  data is fictional.
- **Single neighbourhood, single library.** No multi-library or
  multi-city support in this build.

## What is NOT in this repo

No API key, password, or token of any kind. `.env` is git-ignored and
`.env.example` contains variable names only. The production server log,
`node_modules`, and `.next` are not part of the source.
