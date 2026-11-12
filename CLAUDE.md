# Notepad — notes for Claude

Realtime note-taking app (React + Vite + TypeScript + Tailwind, Firebase Realtime Database, PWA).

## Commands

- Package manager is **Yarn 4** (`.yarnrc.yml`, `yarn.lock`). Use `yarn`, not npm.
- `yarn dev` — dev server. (The Readme still says `yarn start`; that script does not exist.)
- `yarn build` runs `tsc` before `vite build`, so type errors fail the build.
- `yarn lint` runs with `--max-warnings 0`. Fix warnings rather than adding disable comments.
- `yarn sw` is a dependency-install script (adds workbox packages), not a build step.

## Setup

- Copy `.env.example` to `.env`. Every key is `VITE_APP_*`, and the app needs a Firebase project.
- All `VITE_*` values are inlined into the public client bundle. Treat them as public.

## Gotchas

- **Encryption is client-side only.** `encryptData`/`decryptData` (`src/utils/encryptions.ts`) use AES with `VITE_APP_ENCRYPTION_KEY`, which ships in the bundle. It does not hide notes from anyone who can read the database or the app's JS. Don't describe it as end-to-end or secure against the server.
- Notes live under `public-notes/` in Firebase. A note is encrypted only when `encrypted: true`. Decryption happens in `NoteService.getAll` and `useNote`; keep both paths in sync when changing the note shape.
- Realtime data comes from `onValue` listeners. Always return the unsubscribe on unmount, or listeners leak.
- Imports use the `src/...` alias (`tsconfig` `baseUrl: "."` plus the Vite `src` alias). Use it for new imports instead of long relative paths.
- Lint enforces `react-refresh/only-export-components`. Keep component files exporting only components; move constants and helpers elsewhere.
- `vercel.json` rewrites every path to `/`, so the app is a single-page app. Don't add server routes.
- The service worker (`vite-plugin-pwa`, `registerType: "autoUpdate"`) caches built assets. After a deploy, a hard reload may be needed to see changes.

## Conventions

- Don't commit unless asked. Keep `yarn.lock` changes intentional.
