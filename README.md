# Meridian

Meridian is an AI-powered resume builder and career toolkit.

It combines:
- A structured resume editor
- Real-time template preview
- AI rewrite and tailoring tools
- ATS-style scoring helpers
- Post-application support (emails, interview prep, salary estimate)

## What This Project Does

Meridian helps a user go from raw resume content to role-targeted output.

Key capabilities:
- Manage multiple resumes in one workspace
- Edit resume sections in a guided 3-panel editor
- Switch among multiple resume templates instantly
- Set a job target (role/company/JD) to personalize AI output
- Run AI tools: bullet enhancement, summary variants, keyword scan, skill suggestions, auto-tailor, quantification lab
- Export resume to PDF
- Use "Career Agent" tools after writing

## How It Works (Application Flow)

1. Landing (`/`) introduces the product and routes to dashboard.
2. Dashboard (`/dashboard`) is the control layer before editing:
   - Resume library with search, industry filter, and sorting
   - Workspace health scoring (readiness, targeting, metrics signals)
   - Quick-start launch by industry mode
   - Continue-latest actions to open Editor or Career Agent
   - Resume version actions: open, duplicate, delete
3. Editor (`/editor`) is the main workspace:
   - Left: section navigation, section reorder, visibility toggle, industry mode
   - Center: section editors (contact, summary, experience, education, skills, etc.)
   - Right: live template preview from the same store state
4. AI features call `POST /api/ai`, which forwards prompts to Gemini.
5. Career Agent (`/career-agent`) generates follow-up emails, interview prep packs, and salary estimates.
6. Resume data is persisted locally (Zustand `persist`), so work remains available between sessions on the same browser.

## Architecture Summary

- Framework: Next.js 14 (App Router), React 18, TypeScript
- Styling: Tailwind CSS + custom global CSS
- State: Zustand + Immer + Persist middleware
- AI Provider SDK: `@google/generative-ai`
- Export: `html2canvas` + `jspdf`
- Animations/UI: Framer Motion + Lucide icons

Primary folders:
- `src/app`: pages and API route
- `src/components/editor`: editor shell and section editors
- `src/components/templates`: resume templates
- `src/components/ui`: modals, pickers, and reusable UI
- `src/lib`: AI, PDF, utility, and prompt logic
- `src/hooks`: AI feature hooks and assistant workflows
- `src/store`: global resume store
- `src/types`: shared domain types

## Dashboard Controller (Updated)

The dashboard is designed as the operational command center for the editor, not just a list view.

It now provides:
- KPI cards for workspace state (total, ready, targeted, recently updated)
- Central filters (query + industry + sort) to find the right resume fast
- Resume health status per card with missing-check feedback
- Quick-start by industry so users enter editor with the right context
- Workflow shortcuts into Editor and Career Agent from the same resume context
- Workspace signals to surface weak spots before editing starts

## Getting Started

Install and run:

```bash
npm install
npm run dev
```

Then open:

`http://localhost:3000`

Build and run production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Security Note (Current Status)

Important: the current codebase includes hardcoded API keys in source files.

Known locations:
- `src/app/api/ai/route.ts`
- `src/lib/firebase.ts`

This is unsafe for production and will be removed.

Planned remediation:
- Move secrets to environment variables (`.env.local`)
- Rotate exposed keys
- Ensure no secret keys are committed again
- Keep server-only keys out of client bundles

## Change Tracking Policy

This README will be updated whenever we make significant architectural or workflow changes.

Current update log:
- `2026-04-18`: Replaced default README with full Meridian system documentation, workflow map, and security-remediation note for hardcoded keys.
- `2026-04-18`: Rebuilt `/dashboard` into a workspace controller (filters, health scoring, quick-start by industry, workflow shortcuts, and cleaner HCI structure) while preserving the existing visual language.

## Next Planned Update

1. Remove hardcoded API keys and migrate to environment-based configuration.
2. Update this README with the exact env variable names and setup steps after the change is completed.
