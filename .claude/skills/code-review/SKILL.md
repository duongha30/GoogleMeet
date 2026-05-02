---
name: code-review
description: Performs a thorough code review covering correctness, readability, architecture, security, and performance. Reports all findings with confidence and severity levels.
---

# Code Review and Quality

When reviewing code, evaluate each of the following criteria. Report every finding regardless of confidence or severity — include a **Confidence** (high/medium/low) and **Severity** (critical/high/medium/low/info) for each so findings can be ranked downstream.

---

## Correctness

- Logic errors and off-by-one mistakes
- Unhandled edge cases (null, empty, boundary values)
- Race conditions and concurrency issues
- Incorrect assumptions about external data or API contracts
- Missing or incorrect error handling (silent failures, swallowed exceptions)
- State mutations with unintended side effects

## Readability & Simplicity

- Unclear naming (variables, functions, types)
- Functions or components doing too much
- Unnecessary complexity where a simpler approach exists
- Duplicated logic that should be extracted
- Missing context where the *why* is non-obvious (not the *what*)

## Architecture

- Violations of separation of concerns
- Tight coupling between modules that should be independent
- Patterns inconsistent with the rest of the codebase
- Abstractions introduced prematurely or missing where clearly needed
- Breaking changes to public interfaces without versioning

## Security

- Injection vulnerabilities (SQL, command, XSS, path traversal)
- Missing authentication or authorization checks
- Sensitive data in logs, responses, or source control
- Insecure defaults or weak cryptography
- Input not validated at system boundaries (user input, external APIs)

## Performance

- N+1 query patterns or unnecessary repeated work in loops
- Missing indexes on frequently queried fields
- Blocking operations on the main thread or hot path
- Large allocations or memory leaks
- Opportunities for caching that are clearly beneficial and low-risk
