# Development

## Requirements

- Node.js 20+
- pnpm 9+

## Install

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

## Database

```bash
pnpm db:migrate
```

## Run

```bash
pnpm dev:web    # http://localhost:3000
pnpm dev:cms    # http://localhost:3001
```

## Build

```bash
pnpm build:web
pnpm build:cms
```

## Lint

```bash
pnpm lint:web
pnpm lint:cms
```

## Troubleshooting

- If Prisma client is stale: `pnpm db:generate`
- If migrations fail: delete local `*.db` files and re-run `pnpm db:migrate`
- CMS auth defaults: see `CMS_USER` / `CMS_PASSWORD` in `.env.example`
