# App Foundation

One repo, two apps, shared code:

```
apps/
  web/       Next.js (App Router) — deploy to Vercel
  mobile/    Expo + expo-router — iOS & Android (and web, if you want)
packages/
  shared/    Types, data access, validation — imported by both apps as @app/shared
supabase/
  schema.sql Database table for the demo
```

Both apps render the same todo list from the same Supabase table using the same functions
in `packages/shared`. Change `validateTitle` once and both apps pick it up.

## 1. Pick where you develop

**Cloud (no local setup):** on GitHub, click **Code → Codespaces → Create codespace on main**.
The dev container installs Node 22 and runs `npm install` for you.

**Local:** install Node 22 LTS, then `npm install` at the repo root.

## 2. One-time setup

```bash
npm install                          # if not done automatically
(cd apps/mobile && npx expo install --fix)   # snaps Expo deps to the exact versions for its SDK
```

Then set up the database:

1. Create a free project at supabase.com.
2. Paste `supabase/schema.sql` into the SQL Editor and run it.
3. Copy `apps/web/.env.example` → `apps/web/.env.local` and `apps/mobile/.env.example` → `apps/mobile/.env`,
   filling in the URL and anon key from Project Settings → API.

## 3. Run

```bash
npm run web            # http://localhost:3000 (Codespaces opens a preview automatically)
npm run mobile         # local: scan the QR code with Expo Go on your phone
npm run mobile:tunnel  # Codespaces: use this instead so your phone can reach the dev server
```

## 4. Ship

- **Web:** import the repo at vercel.com, set **Root Directory** to `apps/web`, add the two
  `NEXT_PUBLIC_*` env vars. Every push to `main` deploys; every PR gets a preview URL.
- **Mobile:** `npm i -g eas-cli`, then `cd apps/mobile && eas build` builds iOS/Android
  binaries in Expo's cloud — no Mac needed. App Store / Play Store submission needs
  developer accounts (Apple $99/yr, Google $25 one-time). `eas update` pushes JS-only
  changes to installed apps without a store release.
- **CI:** `.github/workflows/ci.yml` typechecks everything and builds the web app on every push/PR.

## Keeping versions aligned

React must be the **same version** in `apps/web` and `apps/mobile` (a monorepo with two
Reacts breaks in confusing ways). Expo's SDK decides which React it supports, so when you
upgrade Expo (`cd apps/mobile && npx expo install expo@latest --fix`), set `apps/web`'s
`react`/`react-dom` to the same version.

## Where to go next

1. Auth: Supabase Auth, with a `user_id` column and per-user RLS policies replacing the demo ones.
2. Styling: Tailwind on web; NativeWind if you want the same classes on mobile.
3. Shared UI: move components into `packages/ui` once you have real repeats.
