# Studio Portfolio — Architecture

## Overview

Studio Portfolio is a pnpm monorepo with two Next.js surfaces and a shared data layer:

```txt
apps/web     → Public portfolio website
apps/cms     → Lightweight content management system
packages/db  → Prisma schema, migrations, snapshot utilities
data/        → Published JSON snapshots (members, projects, site)
```

## Data flow

```txt
┌─────────────────────┐
│        CMS          │
│  Members / Projects │
│  Site Settings      │
└──────────┬──────────┘
           │ Draft / Preview
           ▼
┌─────────────────────┐
│ Publishing Layer    │
│ Validation          │
│ Serialization       │
│ Snapshot Generation │
└──────────┬──────────┘
           │ Published Snapshot
           ▼
┌─────────────────────┐
│    Public Website   │
│ Team / Projects     │
│ Case Studies        │
│ Contact             │
└─────────────────────┘
```

## Storage

- **SQLite** via Prisma stores CMS draft state.
- **JSON snapshots** in `data/` are the published source of truth for the public website.
- **Cloudflare R2** (optional) handles image uploads via presigned URLs.

## Tech stack

- Next.js 16, React 19, TypeScript
- Prisma 6 + SQLite
- next-intl (vi/en)
- Tailwind CSS 4
