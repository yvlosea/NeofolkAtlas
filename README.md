# Neofolk Atlas

Version: `Alpha 10.4`

Neofolk Atlas is a Supabase-backed academic web application centered on structured study, portfolio evidence, and reviewed intellectual work.

This version introduces a simpler Phase 1 learning flow, a dictionary surface for original Neofolk terms, manual JSON-based interface translation, and a calmer mobile-first entry experience.

## Product Direction

The current product goal is:

- simple within five seconds
- deep over time
- mobile-first for India
- multilingual without machine-translated terminology drift
- calm, serious, and distraction-free

## Updated Sitemap

- `Home`
- `Learn`
- `Explore`
- `Groups`
- `Projects`
- `Progress`
- `Dictionary`
- `Vision`
- `Help`

## Navigation Structure

Primary navigation:

- `Learn`
- `Explore`
- `Groups`
- `Projects`
- `Progress`

Secondary navigation:

- `Dictionary`
- `Vision`
- `Help`

## Core Structure

- `Seeker`: learner identity for study, portfolio building, niche tracking, and enrollment
- `Curator`: guide identity for approved module creation
- `Arbiter`: reviewer identity for curator approval, module review, and discovery curation
- `Operator`: top-level universal access role for full-system oversight

## Academic Model

- `Subjects`: structured learning domains
- `Guilds`: academic pathways and directories for module-aligned learning
- `Portfolio`: documented learner work
- `Discovery`: highlighted scholarly work selected through review

## Current Pages

- [index.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/index.html)
- [seeker-dashboard.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/seeker-dashboard.html)
- [curator-dashboard.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/curator-dashboard.html)
- [arbiter-dashboard.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/arbiter-dashboard.html)
- [operator-dashboard.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/operator-dashboard.html)
- [subjects.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/subjects.html)
- [guild.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/guild.html)
- [module.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/module.html)
- [discovery.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/discovery.html)
- [vision.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/vision.html)
- [dictionary.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/dictionary.html)
- [reset-password.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/reset-password.html)

## Phase Model

Phase 1 is the default experience:

- Courses
- Notes
- Projects
- Groups
- Progress

Phase 2 appears later through engagement:

- deeper Guild identity
- Discovery visibility
- Curator pathway
- Arbiter-reviewed surfaces
- advanced portfolio identity

## Translation Architecture

- UI strings now resolve through `t(key)` in [app.js](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/app.js)
- translation files live in:
  - [translations/en.json](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/translations/en.json)
  - [translations/hi.json](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/translations/hi.json)
- homepage language selection is available before login and signup
- dictionary content is translation-ready
- Google Translate is no longer the intended product path

## Terminology Support

- original words remain:
  - `Seeker`
  - `Curator`
  - `Arbiter`
  - `Guild`
  - `Module`
  - `Discovery`
  - `Praxis`
  - `Lingosophy`
- each key term now has:
  - searchable dictionary support
  - reusable inline tooltip support

## Dashboard Structure

The first dashboard now prioritizes:

- current course
- next step
- recent notes
- project creation
- note creation
- progress summary
- suggested tags

It intentionally hides heavier complexity until it becomes useful.

## Tag System Direction

The interdisciplinary tag architecture is expected to support:

- `tags`
- `module_tags`
- `user_tag_follows`
- `tag_links`

This allows modules, projects, and discovery surfaces to move beyond rigid single-subject pathways.

## Backend Expectations

Authentication uses Supabase Auth.

The app currently expects these application tables to exist in Supabase:

- `users`
- `curator_codes`
- `modules`
- `enrollments`
- `portfolio_entries`
- `niche_entries`
- `highlights`
- `verification_reviews`
- `subjects`

The current code still works best when:

- `users.id` matches the Supabase Auth user id
- `users` includes at least `email`, `role`, `verified`, and `created_at`
- `modules.created_by` points to `users.id`

## Operator Access

To grant operator access:

1. Create a real Supabase Auth user.
2. In `public.users`, set that row’s `role` to `operator`.
3. Set `verified` to `true`.
4. Log in normally through the app.

## Major Update Notes In This Version

- all page shells now load `app.js` correctly as an ES module
- missing pages referenced by navigation were added
- the public demo access block was removed from the homepage
- headers now consistently show `Alpha 10.4`
- homepage copy and README were aligned with the current Supabase-based app
- operator routing and navigation were cleaned up so the role behaves like a real access tier
- homepage now prioritizes immediate action over philosophy
- signup now defaults new accounts to `seeker`
- manual JSON translation files now live in `/translations`
- dictionary page explains core Neofolk terminology in plain language
- language selection is visible before authentication
- dashboard entry experience is now intentionally simpler and more phase-based
- seeker dashboard now uses a six-card Amizone-style information hierarchy with calmer mobile-first structure
