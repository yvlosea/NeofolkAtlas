# Neofolk Atlas

Neofolk Atlas is a local-first portfolio-based education platform where Seekers build intellectual records, Curators propose learning modules, and Arbiters approve academic quality.

## Roles

- `Seeker`: approved by default, may edit their profile, create portfolio entries, log niche entries, and enroll in approved modules.
- `Curator`: signs up with a single-use Curator Code, begins with `pending` status, may edit node identity, and may submit modules for review once approved.
- `Arbiter`: seeded manually in code, read-only over user-created learning content except for approval controls and portfolio highlighting.

Permissions are enforced in [app.js](/Users/yashveervatsgaurav/Desktop/Neofolk/app.js). Seekers cannot create modules, Curators cannot approve themselves, and Arbiters cannot create modules or portfolios.

## Status Model

Users and modules use:

- `pending`
- `approved`
- `denied`

Rules:

- Seekers are created as `approved`
- Curators are created as `pending`
- Modules are created as `pending`
- Arbiters may approve or deny Curators and modules
- Denials store a reason visible to the affected Curator or on the denied module record

## Curator Code System

Curator codes are stored as objects in local storage under `neofolk.curatorCodes` and are single-use.

Seeded testing codes:

- `NF-DEL-1001`
- `NF-MUM-1002`
- `NF-BLR-1003`

When a Curator account is created with a valid unused code, the code is marked `used: true` and assigned to that account.

## Portfolio Philosophy

Portfolio entries are the platform's core evidence layer. Each entry includes:

- `id`
- `title`
- `description`
- `guild`
- `reflection`
- `createdBy`
- `highlighted`
- `createdAt`

Seekers see only their own entries. Arbiters can mark selected entries as highlighted, and the discovery page shows only highlighted work.

## Data Collections

The app stores these collections in local storage:

- `neofolk.users`
- `neofolk.curatorCodes`
- `neofolk.modules`
- `neofolk.portfolioEntries`
- `neofolk.nicheEntries`
- `neofolk.enrollments`
- `neofolk.verificationReviews`

## Pages

- [index.html](/Users/yashveervatsgaurav/Desktop/Neofolk/index.html): signup, login, and system overview
- [seeker-dashboard.html](/Users/yashveervatsgaurav/Desktop/Neofolk/seeker-dashboard.html): Seeker workspace
- [curator-dashboard.html](/Users/yashveervatsgaurav/Desktop/Neofolk/curator-dashboard.html): Curator workspace
- [arbiter-dashboard.html](/Users/yashveervatsgaurav/Desktop/Neofolk/arbiter-dashboard.html): Arbiter review controls
- [guild.html](/Users/yashveervatsgaurav/Desktop/Neofolk/guild.html): approved guild modules and approved nodes
- [module.html](/Users/yashveervatsgaurav/Desktop/Neofolk/module.html): module detail with visibility guards
- [discovery.html](/Users/yashveervatsgaurav/Desktop/Neofolk/discovery.html): highlighted academic feed

## Arbiter Login

- email: `arbiter@neofolk.atlas`
- password: `Atlas1842`

## Run

Open [index.html](/Users/yashveervatsgaurav/Desktop/Neofolk/index.html) in a browser and test the full approval flow:

1. Create a Curator with a valid single-use Curator Code.
2. Log in as the Arbiter and approve the Curator.
3. Log in as the Curator and create a module.
4. Log in as the Arbiter and approve the module.
5. Create a Seeker, enroll in the approved module, and publish portfolio work.
6. Return as the Arbiter and highlight selected portfolio entries for discovery.
