---
name: write-prd
description: Help a Product Manager create a comprehensive, structured Product Requirements Document (PRD) from scratch or from a brief. Covers problem framing, user stories, acceptance criteria, metrics, and open questions.
---

# Write PRD

Draft a comprehensive Product Requirements Document grounded in user problems, business context, and engineering constraints — not feature wishlists.

This skill produces a living document. When the user wants to update a specific section, refine a user story, or generate a downstream artifact (e.g., sprint tickets, test cases), route to the appropriate downstream task after the PRD is complete.

## Output Format Selection

- **Explicit user request wins**:
  - If the user asks for `--markdown` or a human-readable doc, output the full markdown PRD.
  - If the user asks for `--json`, output the structured JSON representation of the PRD.
  - If the user asks for `--brief`, output only the Problem Statement, Goals, and User Stories sections.
- **Chat environments (Claude.ai, Claude Code CLI)**: Output full markdown PRD by default.
- **Machine-consumed or API surfaces**: Output raw JSON by default.
- **Ambiguous environment**: Default to markdown.

---

## Workflow

1. **Gather context before writing.**
   Ask the user for the following if not already provided:
   - What problem is being solved? For whom?
   - What is the business goal or success metric?
   - What is the target platform (web, mobile, API, internal tool)?
   - Are there known constraints (timeline, tech stack, dependencies)?
   - Is there an existing brief, spec, or discovery document to reference?

   Do not proceed to drafting until you have at least: a problem statement, a primary user persona, and one measurable goal. If these are missing, ask directly.

2. **Identify the PRD type and scope.**
   Classify the request into one of:
   - **Feature PRD**: A new capability added to an existing product.
   - **Product PRD**: A new standalone product or major rework.
   - **Spike/Exploration PRD**: A time-boxed investigation with a defined output.
   - **Fix/Debt PRD**: Addressing a known gap, bug class, or UX regression.

   Adjust section depth based on scope. A Spike PRD does not need a full rollout plan. A Product PRD needs competitive context.

3. **Draft each section systematically.**
   Work through the PRD template section by section.
   Ground every claim in the user's input, not assumptions.
   Flag gaps explicitly with `[NEEDS INPUT]` placeholders rather than inventing content.
   Keep user stories in the format: `As a [persona], I want to [action] so that [outcome].`

4. **Apply quality checks before delivering.**
   Every acceptance criterion must be testable. Remove vague criteria like "the feature should be fast."
   Every goal must have a measurable metric. Remove goals without a number or observable outcome.
   Every user story must map to at least one acceptance criterion.
   Flag open questions that block implementation.

5. **Present the PRD in the appropriate format.**
   Use markdown for chat environments. Use JSON for machine surfaces.
   Always include a confidence note at the end if sections were drafted with incomplete input.

6. **After delivery, route downstream tasks appropriately.**
   If the user wants to break the PRD into sprint tickets → generate user story tickets.
   If the user wants to validate the PRD against a Figma design → route to `audit-design-system`.
   If the user wants a test plan → generate acceptance test cases from the criteria.

---

## What To Include

- **Problem Statement**: The specific user or business problem being solved, with evidence where available (research, data, complaints, metrics).

- **Goals and Non-Goals**: What success looks like, and explicit scope boundaries to prevent feature creep.

- **User Personas**: The primary and secondary users. Include their context, motivation, and pain point — not just a job title.

- **User Stories**: Discrete, testable units of value. Written from the user's perspective. Not implementation tasks.

- **Acceptance Criteria**: The specific, observable conditions that confirm each user story is done. Written in Given/When/Then or bullet form.

- **Functional Requirements**: The system behaviors required to fulfill the user stories. Numbered for traceability.

- **Non-Functional Requirements**: Performance, accessibility, security, localization, and reliability expectations with measurable thresholds.

- **Success Metrics**: Leading and lagging indicators tied to the goals. Include baseline and target values where known.

- **Dependencies and Risks**: External teams, APIs, data, or timelines the feature depends on. Known risks with a mitigation note.

- **Open Questions**: Unresolved decisions that block implementation or design. Each question should have an owner and a resolution deadline.

- **Out of Scope**: Explicit list of things this PRD does not cover, to prevent scope creep.

---

## What Not To Include

- Implementation details that belong in a technical design doc (e.g., database schema, API contracts, infrastructure choices). Reference them, do not reproduce them.
- Pixel-level design decisions. Reference Figma links; do not describe UI in prose.
- Marketing or go-to-market strategy unless this is a full Product PRD.
- Speculative features with no user evidence. If a stakeholder requested something without user backing, flag it as a risk, not a requirement.
- Internal team processes or sprint ceremonies.

---

## Quality Standard

Every PRD section must answer both questions:

1. **What is being built or decided?**
2. **Why does it matter to the user or the business?**

**Strong evidence includes:**
- User research quotes or survey data
- Support ticket volume or NPS driver analysis
- Competitor benchmarks or market signals
- Business KPIs with a known gap

**Weak evidence includes:**
- "Stakeholders want this"
- "It would be nice to have"
- Any requirement without a user or business rationale

Flag weak evidence with `⚠️ Needs validation` rather than removing it — the PM may have context not yet shared.

---

## PRD Template

Use this structure for every PRD output. Omit sections only when the PRD type explicitly does not require them (e.g., Spike PRDs omit Rollout Plan).

---

### 1. Overview

| Field | Value |
|---|---|
| **Document status** | Draft / In Review / Approved |
| **PRD type** | Feature / Product / Spike / Fix |
| **Author** | [Name] |
| **Last updated** | [Date] |
| **Target release** | [Quarter or milestone] |
| **Primary stakeholders** | [Engineering, Design, Data, Legal, etc.] |

---

### 2. Problem Statement

> One paragraph. What is broken, missing, or painful for the user today? What evidence supports this?

---

### 3. Goals

**Business goal:**
[What business outcome does this drive? Include a metric and target.]

**User goal:**
[What does the user achieve that they couldn't before?]

**Non-goals:**
- [Explicit out-of-scope item 1]
- [Explicit out-of-scope item 2]

---

### 4. User Personas

**Primary persona: [Name or role]**
- Context: [Where and how they use the product]
- Motivation: [What they are trying to accomplish]
- Pain point: [What is currently failing them]

**Secondary persona (if applicable):**
- [Brief description]

---

### 5. User Stories

| ID | User Story | Priority |
|---|---|---|
| US-01 | As a [persona], I want to [action] so that [outcome]. | P0 |
| US-02 | As a [persona], I want to [action] so that [outcome]. | P1 |

Priority scale: **P0** = launch blocker, **P1** = important, **P2** = nice to have.

---

### 6. Acceptance Criteria

**US-01 — [Short story title]**
- [ ] Given [precondition], when [action], then [observable result].
- [ ] Given [precondition], when [action], then [observable result].

**US-02 — [Short story title]**
- [ ] Given [precondition], when [action], then [observable result].

---

### 7. Functional Requirements

| ID | Requirement | Story ref |
|---|---|---|
| FR-01 | [System shall / must / will do X] | US-01 |
| FR-02 | [System shall / must / will do Y] | US-02 |

---

### 8. Non-Functional Requirements

| Category | Requirement | Threshold |
|---|---|---|
| Performance | Page load time | < 2s on 4G |
| Accessibility | WCAG compliance level | AA |
| Security | Auth requirement | [Specify] |
| Availability | Uptime target | 99.9% |
| Localization | Supported languages | [List] |

---

### 9. Success Metrics

| Metric | Type | Baseline | Target | Measurement method |
|---|---|---|---|---|
| [Metric name] | Leading / Lagging | [Current value] | [Goal value] | [Analytics event, dashboard, etc.] |

---

### 10. Dependencies and Risks

**Dependencies:**

| Dependency | Owner | Status | Notes |
|---|---|---|---|
| [API / Team / Dataset] | [Name] | Confirmed / Pending | [Any notes] |

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk description] | High / Med / Low | High / Med / Low | [What will be done] |

---

### 11. Open Questions

| # | Question | Owner | Due date | Status |
|---|---|---|---|---|
| OQ-01 | [Unresolved question] | [Name] | [Date] | Open |

---

### 12. Rollout Plan

- **Rollout strategy**: Full launch / Feature flag / Canary / Beta
- **Target audience for initial release**: [Segment or percentage]
- **Rollback criteria**: [What would trigger a rollback?]
- **Launch checklist items**: [Legal review, accessibility audit, load test, etc.]

---

### 13. Appendix

Links to relevant research, designs, competitive analysis, or technical docs.

---

## Review Heuristics

Use these signals to evaluate PRD completeness before delivery:

**Completeness checklist:**
- [ ] All P0 user stories have at least two acceptance criteria
- [ ] Every goal has a measurable metric
- [ ] At least one risk is documented
- [ ] No `[NEEDS INPUT]` placeholder in P0 sections
- [ ] Open questions have owners

If more than two of these checks fail, flag the PRD as **Draft — Incomplete** in the status field and surface the gaps to the user.

**Depth calibration by PRD type:**

| PRD Type | Required Sections | Optional Sections |
|---|---|---|
| Feature PRD | 1–11 | 12 (Rollout) |
| Product PRD | All (1–13) | None |
| Spike PRD | 1–5, 11 only | Replace 6–9 with "Definition of Done" block |
| Fix PRD | 1–3, 6–8, 10–11 | Skip personas if user is well-understood |

---

## Output Format

### Markdown PRD Output

Deliver the full PRD template populated with the user's content. Apply these rules:

- Use `[NEEDS INPUT]` for any field the user has not provided and that cannot be responsibly inferred.
- Use `⚠️ Needs validation` for content that was inferred but should be verified by the PM.
- Keep the document skimmable: tables over paragraphs for structured data, short paragraphs for narrative sections.
- Do not exceed 3 sentences per narrative paragraph.

### JSON PRD Output

When JSON format is requested, return this shape with no markdown fences and no extra prose:

```json
{
  "meta": {
    "title": "",
    "status": "Draft | In Review | Approved",
    "prd_type": "Feature | Product | Spike | Fix",
    "author": "",
    "last_updated": "",
    "target_release": ""
  },
  "problem_statement": "",
  "goals": {
    "business_goal": "",
    "user_goal": "",
    "non_goals": []
  },
  "personas": [
    {
      "type": "primary | secondary",
      "name": "",
      "context": "",
      "motivation": "",
      "pain_point": ""
    }
  ],
  "user_stories": [
    {
      "id": "US-01",
      "story": "",
      "priority": "P0 | P1 | P2",
      "acceptance_criteria": []
    }
  ],
  "functional_requirements": [
    { "id": "FR-01", "requirement": "", "story_ref": "US-01" }
  ],
  "non_functional_requirements": [
    { "category": "", "requirement": "", "threshold": "" }
  ],
  "success_metrics": [
    { "metric": "", "type": "leading | lagging", "baseline": "", "target": "", "method": "" }
  ],
  "dependencies": [],
  "risks": [],
  "open_questions": [],
  "rollout": {
    "strategy": "",
    "initial_audience": "",
    "rollback_criteria": "",
    "checklist": []
  }
}
```

---

## Example Trigger Phrases

- "Buatkan PRD untuk fitur notifikasi push"
- "Write a PRD for the onboarding redesign"
- "Help me document requirements for the new dashboard"
- "/write-prd I need a PRD for our checkout flow improvements"
- "/write-prd --brief [one-liner brief]" — untuk output Problem + Goals + Stories saja
- "/write-prd --json [brief]" — untuk output JSON
- "/write-prd --markdown [brief]" — untuk output markdown lengkap

---

## Handoff Guidance

Gunakan routing ini setelah PRD selesai:

- User ingin memecah user stories menjadi dev tickets → generate sprint-ready ticket descriptions dari setiap User Story + Acceptance Criteria.
- User ingin memvalidasi PRD terhadap desain → gunakan `audit-design-system` untuk mengecek apakah Figma screen mencerminkan functional requirements.
- User ingin test plan → ekstrak setiap acceptance criterion menjadi structured test case dengan precondition, steps, dan expected result.
- User ingin one-pager untuk stakeholder → rangkum Section 2, 3, 9, dan 10 menjadi executive brief.

Jangan lanjut ke downstream artifacts sebelum PRD memiliki minimal satu P0 user story dengan acceptance criteria yang lengkap.
