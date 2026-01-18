# Phase 0 Microprototype Dashboard Integration - Handoff Document

**Date:** 2025-10-21  
**Handoff To:** New Claude instance in separate Cursor workspace  
**Worktree:** `dashboard-phase-0` (branch: dashboard/phase-0)  
**Task:** Add Phase 0 microprototype tracking to BDD Progress Dashboard

---

## Quick Start

**You are here:** `worktrees/dashboard-phase-0/extraction-bdd-dashboard/`  
**Goal:** Build Carbon SideNav + Phase 0 pages showing microprototype progress  
**Data source:** Parse `.feature` files from `worktrees/microprototype-*/features/`

**First Actions:**
1. Consult OOUX agent for feature naming format (task → outcome)
2. Create API route `/api/bdd/microprototypes` (parse local .feature files)
3. Add Carbon SideNav to layout.tsx (4 nav sections)
4. Build 3 Phase 0 pages (initiate, consent, connect)

---

## Context: Dual-Track Repository

**Track 1: Kubeflow** (Enterprise ML Platform)
- Users: Bella (data scientist), Joel (platform admin)
- Dashboard: `/bdd-progress` (6 features, existing)
- Status: Specification phase

**Track 2: Phase 0 Microprototypes** (plā Health Verification)
- Users: Alice, Bob (people using health verification)
- Dashboard: `/phase-0/*` (TO BE CREATED)
- Status: 5 of 9 BDD features written, 0 implementations built

**Constraint:** Microprototype worktrees FEED data, dashboard worktree BUILDS UI (scope separation)

---

## What's Been Done

### Worktrees Created ✅
```
worktrees/microprototype-initiate/     (INITIATE protocol)
worktrees/microprototype-consent/      (CONSENT protocol)
worktrees/microprototype-connect/      (CONNECT protocol)
worktrees/dashboard-phase-0/           (Dashboard UI work - YOU ARE HERE)
```

### Carbon Installed ✅
```bash
cd worktrees/dashboard-phase-0/extraction-bdd-dashboard
npm list @carbon/react  # Shows: @carbon/react@11.x.x
```

### BDD Features Written ✅
- Microprototype #1: BLE iBeacon Detection (CONSENT) - **COMMITTED**
- Microprototype #2: Lambda SPIFFE Auth (CONNECT)
- Microprototype #3: Biometric Assertion (CONNECT)
- Microprototype #4: APNs Push Notification (CONNECT)
- Microprototype #6: Anonymous Token Storage (INITIATE)

**Status:** 5 features with scenarios, 0 step definitions, 0 implementations

---

## Your Task: Phase 0 Dashboard

### Navigation Structure (Carbon SideNav)

**4 Sections:**
1. Kubeflow Features (existing 6)
2. Phase 0: INITIATE (#6, #8, #9)
3. Phase 0: CONSENT (#1 CRITICAL, #5)
4. Phase 0: CONNECT (#2, #3, #4)

**Reference:** https://react.carbondesignsystem.com/?path=/story/components-ui-shell-sidenav--fixed-side-nav

### Data Strategy

**SHORT-TERM (Implement Now):**
Parse local `.feature` files from worktrees:
```
worktrees/microprototype-initiate/features/microprototype_06_*.feature
worktrees/microprototype-consent/features/microprototype_01_*.feature
worktrees/microprototype-connect/features/microprototype_02_*.feature
...
```

Extract from header comments:
```gherkin
# Protocol: CONSENT
# Technical Question: Can Wallet PassKit trigger iBeacon without custom app?
# Time to Build: 1-2 days
# Success Metric: 10m @ 90% reliability
# CRITICAL: MAKE OR BREAK
```

**LONG-TERM (Document Options):**
- GitHub API (parse files remotely)
- Database (microprototypes write results to DB)
- Hybrid (local dev files, production DB)

**Decision Needed:** How does dashboard update when deployed (no local worktrees)?

### Files to Create

1. **API Route:** `app/api/bdd/microprototypes/route.ts`
   - Reads worktree .feature files
   - Groups by protocol
   - Returns JSON with 3 protocol_groups

2. **Phase 0 Pages:**
   - `app/phase-0/initiate/page.tsx`
   - `app/phase-0/consent/page.tsx` (highlight #1 as CRITICAL)
   - `app/phase-0/connect/page.tsx`

3. **Layout Update:** `app/layout.tsx`
   - Add Carbon SideNav imports
   - 4 navigation sections

4. **Data Strategy Doc:** `docs/DATA_STRATEGY.md`
   - Short-term: Local files
   - Long-term: GitHub API / DB / Hybrid
   - Migration path

---

## Critical Constraints

### 1. Observable Metrics Only

**NEVER:**
- ❌ "User feels confident"
- ❌ "Engineer is satisfied"

**ALWAYS:**
- ✅ "Review board approves for Pilot MVP"
- ✅ "10 consecutive trials succeed"
- ✅ "Microprototype passes Phase 0 with ≥2 stakeholder sign-offs"

**User Quote:** "confidence is never a success metric we use because it is self-reported rather than observed"

### 2. Users = Protocol Users (NOT Engineers)

**INITIATE:** Alice (receiving health status)  
**CONSENT:** Alice, Bob (detecting proximity)  
**CONNECT:** Alice, Bob (biometric auth, push notifications)

**User Quote:** "the users are the users in the protocol"

### 3. User Mental Model: Task → Outcome

**User Quote:** "my mental model is task and outcome based so when I see this work in the BDD-progress-dashboard i can follow the journey"

**Example Card:**
```
CONSENT: Detect Nearby Users → Know Who's Nearby
Pass: 10m @ 90% reliability
Fail: <5m = PIVOT to NFC/QR
```

---

## Open Questions (Consult OOUX Agent First)

**User Said:** "I don't know yet - we may need to consult the OOUX agent"

### Q1: Feature Naming Format
Options:
- "[WHO] does what by how much" (Kubeflow pattern)
- "Task → Outcome" (user's mental model)
- "Protocol: Task" (protocol-first)

### Q2: Card Content
What displays:
- Protocol badge?
- Pass/fail criteria?
- Make-or-break indicator?
- Build status (0 of 9)?
- Technical question?

### Q3: Visual Differentiation
How to show Phase 0 vs Kubeflow:
- Different colors?
- Phase badge?
- Icons?

**Action:** Delegate to OOUX agent BEFORE building UI

---

## Implementation Steps

1. ✅ Verify Carbon installed
2. ⏳ **CONSULT OOUX AGENT** (feature naming + card design)
3. ⏳ Create `/api/bdd/microprototypes` route
4. ⏳ Test API endpoint (should return 3 protocol groups)
5. ⏳ Add Carbon SideNav to layout.tsx
6. ⏳ Create 3 Phase 0 pages
7. ⏳ Document data strategy

---

## Files to Reference

**Phase 0 Specs:**
- `specs/ard/PHASE_0_MICROPROTOTYPES.md`
- `specs/reference/plā_usability_protocols/antidotes_*_usability_protocol.md`
- `MICROPROTOTYPE_WORKTREES.md`

**Dashboard Code:**
- `extraction-bdd-dashboard/README.md`
- `extraction-bdd-dashboard/app/bdd-progress/page.tsx`
- `extraction-bdd-dashboard/components/UniversalCard.tsx`

**Project Guidance:**
- `CLAUDE.md`
- GitHub Issue #7 (feature naming discussion)

---

## Success Criteria

User can:
- Navigate to `/phase-0/consent` via Carbon SideNav
- See Microprototype #1 flagged CRITICAL PATH
- Understand: Detect Nearby Users → Know Who's Nearby
- See pass: "10m @ 90%" | fail: "<5m = PIVOT"
- Track: "0 of 9 built" → updates as implementations added

---

**Start:** Consult OOUX agent for design decisions  
**Then:** Implement SideNav + API + Pages  
**Working Dir:** `worktrees/dashboard-phase-0/extraction-bdd-dashboard`

**Co-authored by:** imstilllearning + claudette  
**Date:** 2025-10-21
