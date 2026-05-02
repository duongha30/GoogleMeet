# Playwright MCP Server Setup — Implementation Plan

> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the Playwright MCP server so Claude Code can control a browser directly from this project's Claude sessions.

**Architecture:** Install `@playwright/mcp` as a project-level MCP server registered in `.claude/settings.json`. Claude Code reads this file on startup and launches the server automatically, giving Claude browser-control tools (navigate, click, screenshot, etc.).

**Stack:** Node.js · Claude Code MCP config (`.claude/settings.json`) · Playwright

---

## File Structure

| Action | Path |
|---|---|
| Create | `.claude/settings.json` |
| Create | `docs/plans/2026-05-02-playwright-mcp-server.md` (this plan) |

---

### Task 1: Install Playwright MCP

**Files:** none (global install, no package.json change needed)

- [x] **Step 1: Install the package globally**

  ```bash
  npm install -g @playwright/mcp@latest
  ```

- [x] **Step 2: Install Playwright browsers**

  ```bash
  npx playwright install chromium
  ```

- [x] **Step 3: Verify binary is reachable**

  ```bash
  npx @playwright/mcp --version
  ```

  Result: `Version 0.0.73`

---

### Task 2: Register the MCP server in the project

**Files:**
- Create: `.claude/settings.json`

- [x] **Step 1: Create `.claude/settings.json`**

  ```json
  {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add .claude/settings.json docs/plans/2026-05-02-playwright-mcp-server.md
  git commit -m "feat: add Playwright MCP server for browser control"
  ```

---

### Task 3: Verify Claude Code picks up the server

**Files:** none

- [ ] **Step 1: Restart Claude Code and check MCP status**

  ```bash
  claude mcp list
  ```

  Expected: `playwright` listed with status `connected`

- [ ] **Step 2: Confirm browser tools are available**

  In a Claude Code session, ask:
  > "Use Playwright to navigate to http://localhost:5173 and take a screenshot."

  Expected: Claude uses `browser_navigate` and `browser_screenshot` tools without error.

---

## Verification

1. `claude mcp list` shows `playwright` as connected
2. Claude can open `http://localhost:5173` (start `npm run dev` first) and return a screenshot
3. `.claude/settings.json` is committed and visible in `git status`
