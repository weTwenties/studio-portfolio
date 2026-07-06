# Studio Portfolio

A dual-surface portfolio platform combining a public website, a lightweight CMS, and a snapshot-based publishing workflow.

Built and maintained by [weTwenties](https://github.com/weTwenties).

## Architecture

```txt
┌─────────────────────┐
│        CMS          │
│                     │
│ Members             │
│ Projects            │
│ Site Settings       │
│ SEO                 │
└──────────┬──────────┘
           │
           │ Draft / Preview
           ▼
┌─────────────────────┐
│ Publishing Layer    │
│                     │
│ Validation          │
│ Serialization       │
│ Snapshot Generation │
└──────────┬──────────┘
           │
           │ Published Snapshot
           ▼
┌─────────────────────┐
│    Public Website   │
│                     │
│ Team                │
│ Projects            │
│ Case Studies        │
│ Contact             │
└─────────────────────┘
```

## Core features

- **Public website** — bilingual portfolio (vi/en) with team directory, project case studies, and contact form
- **CMS** — manage members, projects, services, CTA, and SEO without touching code
- **Snapshot publishing** — draft in SQLite, publish to JSON snapshots consumed by the public site
- **Image uploads** — optional Cloudflare R2 integration via presigned URLs

## Monorepo structure

```txt
studio-portfolio/
├── apps/
│   ├── web/          # Public Next.js site
│   └── cms/          # CMS Next.js app
├── packages/
│   └── db/           # Prisma + snapshot utilities
├── data/             # Published JSON snapshots
└── docs/             # Architecture & development docs
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Prisma 6 · SQLite · next-intl · Tailwind CSS 4 · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev:web    # http://localhost:3000
pnpm dev:cms    # http://localhost:3001
```

## Environment variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path for CMS |
| `PUBLISHED_DATA_DIR` | Snapshot JSON directory |
| `CMS_USER` / `CMS_PASSWORD` | CMS basic auth |
| `R2_*` | Optional Cloudflare R2 for image uploads |

## Demo data

The `data/` directory ships with sanitized demo content (fictional members and projects). Replace with your own before deploying.

## Documentation

- [Architecture](docs/architecture.md)
- [Publishing flow](docs/publishing-flow.md)
- [Content model](docs/content-model.md)
- [Development](docs/development.md)

## Project status

Engineering showcase — public source for demonstration, not an open-source contribution project.
