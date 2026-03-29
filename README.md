# Neofolk Atlas

Version: `v0.6.2 Alpha`

Neofolk Atlas is a Supabase-backed academic web application centered on structured study, portfolio evidence, and reviewed intellectual work.

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
- [reset-password.html](/Users/yashveervatsgaurav/Desktop/Nefolk/NF atlas/reset-password.html)

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
- headers now consistently show `v0.6.2 Alpha`
- homepage copy and README were aligned with the current Supabase-based app
- operator routing and navigation were cleaned up so the role behaves like a real access tier
