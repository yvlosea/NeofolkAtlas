# Neofolk Atlas

Version: `Alpha 12.0`

Neofolk Atlas is a Supabase-backed academic web application centered on structured study, portfolio evidence, and reviewed intellectual work.

## Product Direction

- Simple within five seconds
- Deep over time
- Mobile-first for India
- Multilingual without machine-translated terminology drift
- Calm, serious, and distraction-free

## Tech Stack

- **Frontend**: Static HTML/CSS/JavaScript (no build step)
- **Backend**: Supabase (Auth, session management)
- **Styling**: Custom CSS design system (Dark Academia x Solarpunk)
- **Fonts**: Cormorant Garamond, Manrope, Noto Sans/Serif Devanagari, Noto Nastaliq Urdu (Google Fonts CDN)
- **Charts**: Chart.js 4.4.0 (homepage only)
- **i18n**: Manual JSON translation files with `t(key)` resolver

## Supported Languages

- English (`en`)
- Hindi (`hi`) — Devanagari script
- Urdu (`ur`) — Nastaliq script, RTL layout

Language can be changed from the sidebar on any page or from the mobile topbar.

## Sitemap

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with signup/login, quote carousel, chart, about section |
| Seeker Dashboard | `seeker-dashboard.html` | Default learner dashboard with stats and next steps |
| Curator Dashboard | `curator-dashboard.html` | Content curator dashboard |
| Arbiter Dashboard | `arbiter-dashboard.html` | Reviewer/moderator dashboard |
| Operator Console | `operator-dashboard.html` | Platform admin console |
| Subjects | `subjects.html` | Browse 10 academic guild domains |
| Guild Directory | `guild.html` | Learning groups and shared inquiry |
| Discovery | `discovery.html` | Curated academic work showcase |
| Dictionary | `dictionary.html` | Searchable glossary of 8 Neofolk terms |
| Vision | `vision.html` | Platform philosophy and domain model |
| Help | `help.html` | Onboarding guide and platform usage |
| Research | `research.html` | Research projects and documentation |
| Profile | `profile.html` | User profile and learning record |
| Module | `module.html` | Individual course module view |
| Studios | `studios.html` | Creative studio workspace |
| Reset Password | `reset-password.html` | Password recovery form |

## Navigation Structure

Sidebar navigation (rendered dynamically by `app.js` on all pages):

- Home
- Dashboard (role-based)
- Learn (Subjects)
- Groups (Guilds)
- Explore (Discovery)
- Dictionary
- Vision
- Help
- Logout

## Core Roles

| Role | Description | Dashboard |
|------|-------------|-----------|
| **Seeker** | Default learner role — study, notes, projects, portfolio | `seeker-dashboard.html` |
| **Curator** | Creates structured learning modules | `curator-dashboard.html` |
| **Arbiter** | Reviews modules, approvals, and quality control | `arbiter-dashboard.html` |
| **Operator** | Full platform administration | `operator-dashboard.html` |

## Academic Model

- **Subjects**: 10 structured learning domains (Lingosophy, Arthmetics, Cosmology, Biosphere, Chronicles, Civitas, Tokenomics, Artifex, Praxis, Bioepisteme)
- **Guilds**: Collaborative research groups organized around shared interests
- **Portfolio**: Documented learner work (essays, projects, reflections)
- **Discovery**: Highlighted scholarly work selected through arbiter review
- **Modules**: Structured courses within subjects
- **Studios**: Capability environments unlocked through contribution

## Authentication Flow

1. **Signup**: Email + password via Supabase Auth, email confirmation required
2. **Login**: Email + password, redirects to role-based dashboard
3. **Forgot Password**: Sends reset email via Supabase, redirects to `reset-password.html`
4. **Reset Password**: Token-based password update via `supabase.auth.updateUser()`
5. **Logout**: Sidebar button on all pages, calls `supabase.auth.signOut()`

## Translation Architecture

- UI strings resolve through `t(key)` in `app.js`
- Translation files:
  - `translations/en.json` — English (complete)
  - `translations/hi.json` — Hindi (complete)
  - `translations/ur.json` — Urdu (partial)
- All dynamically rendered page content uses the translation system
- Dictionary terms are translation-ready with label, simple meaning, expanded meaning, and example use
- Language preference persists in `localStorage`

## Terminology

Original Neofolk terms are preserved across all languages:

| Term | Meaning |
|------|---------|
| Seeker | Student building an intellectual record through study |
| Curator | Teacher who creates structured learning modules |
| Arbiter | Reviewer who ensures academic quality |
| Guild | Learning group organized around shared interests |
| Module | Structured course inside the platform |
| Discovery | Public showcase of notable academic work |
| Praxis | Learning through disciplined practice and action |
| Lingosophy | Study of language, thought, and meaning |

## Phase Model

**Phase 1** (default experience): Courses, Notes, Projects, Groups, Progress

**Phase 2** (appears through engagement): Deeper Guild identity, Discovery visibility, Curator pathway, Arbiter-reviewed surfaces, advanced portfolio identity

## Supabase Configuration

Each HTML page includes Supabase credentials via meta tags:

```html
<meta name="supabase-url" content="https://YOUR_PROJECT.supabase.co" />
<meta name="supabase-anon-key" content="YOUR_ANON_KEY" />
```

Alternatively, set `window.NEOFOLK_SUPABASE_URL` and `window.NEOFOLK_SUPABASE_ANON_KEY` before `app.js` loads.

## Backend Expectations

The app expects these Supabase tables:

- `users` (with `email`, `role`, `verified`, `created_at`)
- `modules`, `enrollments`, `portfolio_entries`
- `subjects`, `highlights`, `verification_reviews`
- `curator_codes`, `niche_entries`

`users.id` should match the Supabase Auth user id. `modules.created_by` points to `users.id`.

## Operator Access

1. Create a Supabase Auth user
2. In `public.users`, set `role` to `operator` and `verified` to `true`
3. Log in normally through the app

## File Structure

```
NeofolkAtlas/
  index.html              # Landing page
  app.js                  # Core app logic (auth, nav, i18n, page rendering)
  styles.css              # Global design system (1740+ lines)
  internal-styles.css     # Internal page theming
  neofolk-logo.jpg        # Brand logo
  translations/
    en.json               # English translations
    hi.json               # Hindi translations
    ur.json               # Urdu translations
  *-dashboard.html        # Role-specific dashboards (4)
  *.html                  # Content pages (12)
```
