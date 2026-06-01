# Sync Mockup Plan

## Product Promise

Sync lets musicians register session credits in the room. A creator starts a record, collaborators tap in with phones, agree to roles and splits, and everyone leaves with a shared transparent ledger.

## MVP Scope

- Create a recording session with title, artist, location, and date.
- Installable phone app experience through PWA first, with native wrappers later if needed.
- Tap-in flow for collaborators using NFC, QR fallback, or invite link.
- Contributor profile: legal name, public artist name, role, wallet/payment handle, PRO/IPI details.
- Split confirmation with lightweight approval from every contributor.
- Immutable event ledger showing who joined, what changed, and when.
- Export package for labels, distributors, PROs, publishers, and lawyers.

## Demo Flow

1. Open a session called "Midnight Signal."
2. Show four phones tapping in and becoming contributors.
3. Adjust splits and roles.
4. Confirm the record.
5. Display the transparent ledger and export-ready summary.

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
