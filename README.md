# Daily Tracker Starter

A production-style monorepo starter for a daily tracker app using **Next.js for web** and **Expo/React Native for iOS**, with shared TypeScript logic.

## Apps
- `apps/web` — Next.js App Router web app with dashboard, today view, stats, dark mode, and PWA-ready manifest.
- `apps/native` — Expo Router app with tab navigation for Today, Calendar, and Stats.
- `packages/core` — shared tracking models, seed data, and streak/stat helpers.
- `packages/ui` — shared design tokens and helper exports.

## Features included
- Habit/daily tracker cards
- Completion stats
- Streak calculation
- Weekly trend helper
- Clean modern UI structure
- Shared sample data
- Web dark mode toggle
- iOS-friendly mobile layout scaffold

## Suggested next steps
1. Add persistence with Supabase, Convex, Firebase, or local SQLite.
2. Add notifications/reminders.
3. Add auth and sync.
4. Replace seed data with real backend/API state.

## Run
```bash
pnpm install
pnpm dev:web
pnpm dev:native
```

## Notes
- The web app is structured for Next.js App Router and a PWA manifest.
- The native app is structured for Expo Router tabs.
- Shared business logic lives in `packages/core`.
