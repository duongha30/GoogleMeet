Perform a thorough code review of $ARGUMENTS (files, a diff, or the current branch's changes against main).

Report every issue you find, including ones you are uncertain about or consider low-severity. Do not filter for importance or confidence — a separate verification step will do that. It is better to surface a finding that later gets filtered out than to silently drop a real bug.

For each finding include:
- **Confidence**: high / medium / low
- **Severity**: critical / high / medium / low / info
- **Location**: file and line number(s)
- **Description**: what the issue is and why it matters

Review checklist:

**Code Quality**
- Readability and naming clarity
- Dead code, unused variables, redundant logic
- Functions/components doing too much (single responsibility)
- Hardcoded values that should be constants or config

**Security**
- Injection vulnerabilities (SQL, command, XSS)
- Improper authentication or authorization checks
- Sensitive data exposure (secrets in code, unmasked logs)
- Insecure direct object references

**Error Handling**
- Unhandled promise rejections or uncaught exceptions
- Silent failures (empty catch blocks, swallowed errors)
- Missing validation at system boundaries (user input, API responses)
- Misleading or missing error messages

**Testing**
- Missing tests for new logic or edge cases
- Tests that assert the wrong thing or pass trivially
- Mocked behavior that diverges from real implementation

**Database**
- Missing indexes on queried fields
- N+1 query patterns
- Mutations outside transactions where atomicity is needed
- Query inputs lacking validation or sanitization

**API**
- Incorrect HTTP methods or status codes
- Missing or inconsistent input validation
- Breaking changes to existing contracts
- Undocumented fields or behavior changes
