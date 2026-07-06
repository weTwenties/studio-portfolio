# Publishing Flow

## Workflow

```txt
CMS editor
  ↓
Draft (SQLite)
  ↓
Validation
  ↓
Preview
  ↓
Publish action
  ↓
Serialization + translation (optional)
  ↓
Snapshot JSON → data/
  ↓
Public website reads snapshot
```

## Snapshot files

| File | Content |
|------|---------|
| `data/members.json` | Team members with roles, bios, project links |
| `data/projects.json` | Portfolio projects with case studies |
| `data/site.json` | Brand, SEO, contact, footer |

## Environment

Set `PUBLISHED_DATA_DIR` to the snapshot directory (default: `./data`).

Both `apps/cms` and `apps/web` read from this shared path at publish/read time.
