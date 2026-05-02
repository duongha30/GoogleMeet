---
name: writing-plan
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for the codebase. Document everything they need to know: which files to touch, exact code, how to manually verify the change. Give them the whole plan as bite-sized tasks. DRY. YAGNI. Frequent commits.

Assume they are a skilled developer but know almost nothing about this stack or problem domain.

**Announce at start:** "I'm using the writing-plan skill to create the implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md` *(user preferences override this)*

---

## Project Stack

All plans must use this project's actual stack — never reference Python, pytest, or unrelated tooling.

| Layer | Technology |
|---|---|
| Frontend | React 18 + React Router v6, JSX, SCSS |
| Build | Vite (`npm run dev:client`, `npm run build`) |
| Backend | Express + Socket.IO on port 3000 (`npm run dev:server`) |
| Signaling | PeerJS server on port 3001 (`npm run peer-server`) |
| Language | JavaScript (no TypeScript, no test runner, no linter) |

**Key paths:**
- Frontend pages: `client/src/pages/`
- Components: `client/src/components/`
- Styles: `client/src/styles/` (SCSS partials, imported in `app.scss`)
- Server: `server/index.js` (Socket.IO), `server/peer-server.js` (PeerJS)

---

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking it into separate plans — one per subsystem. Each plan should produce working, verifiable software on its own.

---

## File Structure

Before defining tasks, map out which files will be created or modified and what each is responsible for. This is where decomposition decisions get locked in.

- Each file has one clear responsibility with well-defined interfaces
- Prefer smaller, focused files over large ones that do too much
- Files that change together should live together — split by responsibility, not technical layer
- Follow established patterns in this codebase (functional React components, hooks for state, Socket.IO events for server communication)
- This structure informs task decomposition — each task should produce self-contained changes

---

## Bite-Sized Task Granularity

Each step is one action (2–5 minutes):

1. Make the change (UI, logic, or server-side)
2. Start dev server and verify in browser: `npm run dev`
3. Commit

Since there is no test runner, verification is manual. Each step must describe exactly what to open in the browser and what to confirm.

---

## Plan Document Header

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2–3 sentences about approach]

**Stack:** React 18 + Vite · Express/Socket.IO · PeerJS · SCSS
```

---

## Task Structure

```markdown
### Task N: [Component Name]

**Files:**
- Create: `client/src/components/ExampleComponent.jsx`
- Modify: `client/src/pages/Room.jsx`
- Style: `client/src/styles/_example.scss`

- [ ] **Step 1: Add the component**

      ```jsx
      // client/src/components/ExampleComponent.jsx
      function ExampleComponent({ value, onChange }) {
          return <div className="example">{value}</div>
      }

      export default ExampleComponent
      ```

- [ ] **Step 2: Wire it into Room.jsx**

      ```jsx
      // add to imports at top of Room.jsx
      import ExampleComponent from '../components/ExampleComponent'

      // add inside the returned JSX
      <ExampleComponent value={someState} onChange={setSomeState} />
      ```

- [ ] **Step 3: Add styles**

      ```scss
      // client/src/styles/_example.scss
      .example {
          color: $primary-color;
      }
      ```

      Import in `app.scss`:
      ```scss
      @use 'example';
      ```

- [ ] **Step 4: Verify**

      Run: `npm run dev`
      Open: `http://localhost:5173`
      Confirm: [exact behavior to observe]

- [ ] **Step 5: Commit**

      ```bash
      git add client/src/components/ExampleComponent.jsx client/src/pages/Room.jsx client/src/styles/_example.scss client/src/styles/app.scss
      git commit -m "feat: add example component"
      ```
```

---

## No Placeholders

Every step must contain the actual content an engineer needs. These are plan failures — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Similar to Task N" — repeat the code; the engineer may read tasks out of order
- Steps that describe *what* to do without showing *how* (code blocks required for code steps)
- Verification steps without a specific URL and observable outcome
- References to functions, components, or Socket.IO events not defined in any task

**Remember:** exact file paths, complete code in every step, exact commands, specific browser verification.

---

## Self-Review

After writing the complete plan, check it against the spec:

1. **Spec coverage** — can you point to a task for each requirement? List any gaps.
2. **Placeholder scan** — search for any patterns from the No Placeholders section above and fix them.
3. **Consistency** — do component names, prop names, and Socket.IO event names match across tasks?

Fix issues inline. If a spec requirement has no task, add the task.

---

## Execution Handoff

After saving the plan, confirm:

> "Plan saved to `docs/plans/<filename>.md`. Ready to implement task-by-task — say 'start' to begin with Task 1, or specify a task number."
