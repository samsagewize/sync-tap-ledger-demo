# Sync Mockup Plan

## Product Promise

Sync helps musicians prepare BMI/ASCAP song registration without the usual collaborator chase. A creator opens a registration room, invites every writer by QR/NFC/link, each collaborator installs the app and completes their rights profile, and the room produces one transparent registration-ready packet.

## MVP Scope

- Create a recording session with title, artist, location, and date.
- Installable phone app experience through PWA first, with native wrappers later if needed.
- Tap-in flow for collaborators using NFC, QR fallback, or invite link.
- Contributor profile: legal name, public artist name, role, PRO affiliation, IPI/CAE, publisher name, publisher IPI, and contact details.
- Split confirmation with lightweight approval from every contributor.
- Readiness checks for missing writer, publisher, share, and approval fields.
- Immutable event ledger showing who joined, what changed, and when.
- Export packet for BMI/ASCAP registration, publishing admins, labels, distributors, and lawyers.

## Demo Flow

1. Open a registration room called "Midnight Signal."
2. Show four phones joining through QR/NFC/app install.
3. Collect each writer's PRO, IPI/CAE, publisher, and split.
4. Flag missing registration fields before submission.
5. Display the transparent ledger and BMI/ASCAP-ready packet summary.

## Launch Path

- Week 1: Clickable prototype and musician interviews.
- Week 2: NFC/QR tap-in proof of concept, account profiles, basic ledger.
- Week 3: Split agreement workflow, PDF/CSV export, email receipts.
- Week 4: Private beta with 5-10 studios or writing camps.
- After beta: package native iOS/Android apps with Capacitor or React Native once device NFC requirements are proven.

## Risks To Resolve

- Legal validity of signatures and split approvals by region.
- Identity verification depth needed for distributors and PROs.
- How to handle disputes, edits, minors, and missing contributors.
- Interop with existing publishing/admin tools.

## Suggested Business Model

- Free for small sessions.
- Studio/team plan for repeat rooms and writing camps.
- Per-record export package or admin handoff fee.
