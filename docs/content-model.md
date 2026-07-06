# Content Model

## Public entities

### Site

Brand identity, navigation, footer, SEO metadata, and contact email.

### Member

Team member profile: name, role, bio (vi/en), avatar, CV link, social links, sort order.

### Project

Portfolio case: title, summary, cover image, demo URL, tags, case study (problem/solution/result).

### Service

Three service cards on the landing page (configured via CMS).

## CMS-only state

Draft content lives in SQLite (`Member`, `Project`, `SiteSettings` tables) until published to JSON snapshots.

## Relations

- `MemberProject` — many-to-many link between members and projects with optional role label.
