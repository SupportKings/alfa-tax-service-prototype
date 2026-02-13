# Template-2025 Modernization PRD

> **Purpose**: This document provides a comprehensive roadmap for transforming this template into a best-in-class, agent-ready, production-grade starter template.

---

## Quick Start for Implementing Agent

```bash
# 1. First, read this entire PRD
# 2. Then start with Phase 1 (Testing)

bun install
bun dev  # Verify everything works first
```

**Start command for Claude:**
```
Read IMPROVEMENT_PRD.md and implement Phase 1 (Testing Infrastructure).
Create vitest.config.ts, test utilities, and one example test per app.
```

**Priority Quick Wins (do these first):**
1. Add `LICENSE` file (MIT) - 2 minutes
2. Create `CONTRIBUTING.md` skeleton - 10 minutes
3. Setup Husky pre-commit hook - 15 minutes
4. Add one simple Vitest test - 20 minutes

These 4 items alone will boost the repo significantly.

---

## Current State Analysis

### What We Have (Strengths)

| Category | Status | Details |
|----------|--------|---------|
| **Architecture** | Excellent | Monorepo with Turborepo, feature-based organization, clean separation |
| **Tech Stack** | Modern | Next.js 15, React 19, Bun, tRPC, Drizzle, Better Auth, TailwindCSS v4 |
| **Type Safety** | Strong | Strict TypeScript, tRPC end-to-end types, Zod validation |
| **Code Standards** | Documented | Biome config, import ordering, class sorting, custom plugins |
| **Claude Docs** | Comprehensive | 20KB CLAUDE.md + 16 docs in /docs/claude (3,152 lines total) |
| **Patterns** | Consistent | Feature folders, Server Components, React Query, Server Actions |

### What's Missing (Critical Gaps)

| Category | Gap | Impact |
|----------|-----|--------|
| **Testing** | Zero test infrastructure | Cannot verify code quality, no TDD |
| **CI/CD** | No GitHub Actions | No automated checks, manual deployment |
| **Pre-commit** | No git hooks | Broken code can be committed |
| **API Docs** | No tRPC documentation | Hard to understand available endpoints |
| **Contributing** | No CONTRIBUTING.md | Team collaboration undefined |
| **Monitoring** | No error tracking | Production issues invisible |
| **Docker** | No containerization | Inconsistent environments |
| **Database Docs** | No schema documentation | Hard to understand data model |
| **Changelog** | No version history | No release tracking |
| **License** | No LICENSE file | Legal ambiguity |

---

## Implementation Tasks

### Phase 1: Testing Infrastructure (Priority: CRITICAL)

#### Task 1.1: Setup Vitest for Unit Testing
```
Location: /apps/web, /apps/server
Files to create:
- vitest.config.ts (both apps)
- /tests/setup.ts
- /tests/utils/test-utils.tsx (React Testing Library setup)
```

**Requirements:**
- Configure Vitest with TypeScript support
- Setup React Testing Library for component testing
- Create test utilities for mocking tRPC, auth, and Supabase
- Add coverage reporting with v8
- Minimum 80% coverage target

**Example test structure:**
```
/apps/web/tests/
├── setup.ts
├── utils/
│   ├── test-utils.tsx
│   ├── mock-trpc.ts
│   └── mock-auth.ts
├── unit/
│   └── components/
└── integration/
    └── features/
```

#### Task 1.2: Setup Playwright for E2E Testing
```
Location: /apps/web
Files to create:
- playwright.config.ts
- /e2e/
  ├── auth.spec.ts
  ├── dashboard.spec.ts
  └── fixtures/
```

**Requirements:**
- Configure Playwright with multiple browsers
- Create auth fixtures for authenticated tests
- Setup visual regression testing
- CI-optimized configuration

#### Task 1.3: Add Test Scripts to package.json
```json
{
  "scripts": {
    "test": "turbo run test",
    "test:unit": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### Phase 2: CI/CD Pipeline (Priority: CRITICAL)

#### Task 2.1: Create GitHub Actions Workflow
```
Location: /.github/workflows/
Files to create:
- ci.yml (lint, type-check, test on PR)
- deploy-preview.yml (Vercel preview deployments)
- deploy-production.yml (production deployment)
```

**ci.yml requirements:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    - Checkout
    - Setup Bun
    - Install dependencies
    - Run biome check
    - Run type-check
    - Run unit tests
    - Run E2E tests (on main only)
    - Upload coverage
```

#### Task 2.2: Add Branch Protection Rules Documentation
```
Location: /docs/CONTRIBUTING.md
Content:
- Required status checks
- Review requirements
- Branch naming conventions
```

---

### Phase 3: Git Hooks & Pre-commit (Priority: HIGH)

#### Task 3.1: Setup Husky + lint-staged
```
Location: root
Files to create:
- .husky/pre-commit
- .husky/commit-msg
- .lintstagedrc.js
```

**Pre-commit hook:**
```bash
#!/bin/sh
bunx lint-staged
```

**lint-staged config:**
```js
{
  "*.{ts,tsx}": ["biome check --apply"],
  "*.{json,md}": ["biome format --write"]
}
```

#### Task 3.2: Setup Commitlint
```
Location: root
Files to create:
- commitlint.config.js
```

**Commit message format:**
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

---

### Phase 4: Documentation Improvements (Priority: HIGH)

#### Task 4.1: Create CONTRIBUTING.md
```
Location: /CONTRIBUTING.md
Content:
- How to fork and clone
- Development setup
- Branch naming (feature/, fix/, docs/)
- Commit message format
- PR process and template
- Code review checklist
- Testing requirements
```

#### Task 4.2: Create API Documentation
```
Location: /docs/API.md
Content:
- Available tRPC routers
- Procedure signatures
- Request/response types
- Authentication requirements
- Example usage
```

#### Task 4.3: Create Database Schema Documentation
```
Location: /docs/DATABASE.md
Content:
- ER diagram (Mermaid)
- Table descriptions
- Relationships
- Indexes
- Migration history
```

#### Task 4.4: Add LICENSE File
```
Location: /LICENSE
Content: MIT License (or appropriate license)
```

#### Task 4.5: Create CHANGELOG.md
```
Location: /CHANGELOG.md
Format: Keep a Changelog
```

---

### Phase 5: Clean Root CLAUDE.md (Priority: MEDIUM)

#### Task 5.1: Restructure CLAUDE.md
Current issues:
- Too long (444 lines, 20KB)
- Mixes template instructions with development guidelines
- Some redundant sections

**New structure:**
```markdown
# CLAUDE.md

## Quick Reference
- Tech stack summary
- Essential commands
- Key files

## Architecture
- Link to /docs/claude/architecture.md

## Code Standards
- Link to /docs/claude/code-quality.md

## Development Workflow
- Link to /docs/claude/commands.md

## Troubleshooting
- Link to /docs/claude/troubleshooting.md
```

Target: Under 200 lines with links to detailed docs

---

### Phase 6: Agent Skills & Automation (Priority: MEDIUM)

#### Task 6.1: Create /docs/AGENTS.md
See separate AGENTS.md file for full content

#### Task 6.2: Create Feature CLAUDE.md Files
```
Locations:
- /apps/web/CLAUDE.md (frontend-specific)
- /apps/server/CLAUDE.md (backend-specific)
- /packages/emails/CLAUDE.md (email-specific)
```

Each should contain:
- Component-specific guidelines
- Local commands
- Common patterns
- Testing approach

#### Task 6.3: Setup MCP Integration
```
Location: /.mcp.json
Action: Initialize from .mcp.json.example with:
- Supabase connection
- Database query permissions
- Read-only by default
```

---

### Phase 7: Production Readiness (Priority: MEDIUM)

#### Task 7.1: Add Error Monitoring
```
Package: @sentry/nextjs
Files:
- sentry.client.config.ts
- sentry.server.config.ts
- sentry.edge.config.ts
```

#### Task 7.2: Add Structured Logging
```
Package: pino
Location: /apps/server/src/lib/logger.ts
```

#### Task 7.3: Create Docker Configuration
```
Files:
- Dockerfile (multi-stage for web)
- Dockerfile.server
- docker-compose.yml (local dev with Supabase)
- docker-compose.prod.yml
```

#### Task 7.4: Add Rate Limiting
```
Location: /apps/server/src/middleware/rate-limit.ts
Package: hono rate-limiter
```

---

### Phase 8: Template Cleanup (Priority: LOW)

#### Task 8.1: Remove @ts-ignore Comments
Search for: `@ts-ignore.*Template build`
Action: Replace with proper types or remove dead code

#### Task 8.2: Clean Mock Data
Search for: `any[]` type annotations, hardcoded data
Action: Replace with proper types and remove mocks

#### Task 8.3: Update .env.example Files
Ensure all required variables are documented with descriptions

---

## Success Criteria

### Testing
- [ ] Vitest configured and running
- [ ] Playwright configured and running
- [ ] Minimum 1 test per feature module
- [ ] Coverage reporting enabled

### CI/CD
- [ ] GitHub Actions runs on every PR
- [ ] All checks must pass before merge
- [ ] Preview deployments working

### Documentation
- [ ] CONTRIBUTING.md complete
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] LICENSE file added

### Code Quality
- [ ] Pre-commit hooks working
- [ ] Commit message validation
- [ ] No @ts-ignore template comments
- [ ] Root CLAUDE.md under 200 lines

### Agent Readiness
- [ ] /docs/AGENTS.md complete
- [ ] Per-app CLAUDE.md files created
- [ ] MCP configured
- [ ] Feature-specific skills documented

---

## File Checklist

### Files to Create
```
/.github/workflows/ci.yml
/.github/workflows/deploy-preview.yml
/.husky/pre-commit
/.husky/commit-msg
/.lintstagedrc.js
/commitlint.config.js
/CONTRIBUTING.md
/CHANGELOG.md
/LICENSE
/docs/API.md
/docs/DATABASE.md
/docs/AGENTS.md
/apps/web/CLAUDE.md
/apps/web/vitest.config.ts
/apps/web/playwright.config.ts
/apps/web/tests/setup.ts
/apps/web/tests/utils/test-utils.tsx
/apps/web/e2e/auth.spec.ts
/apps/server/CLAUDE.md
/apps/server/vitest.config.ts
/packages/emails/CLAUDE.md
/docker-compose.yml
/Dockerfile
```

### Files to Modify
```
/CLAUDE.md (restructure, reduce size)
/package.json (add test scripts)
/apps/web/package.json (add test dependencies)
/apps/server/package.json (add test dependencies)
/.mcp.json.example → .mcp.json (initialize)
```

### Files to Review
```
All files with @ts-ignore.*Template build
All files with any[] type annotations
```

---

## Execution Order

1. **Start with Testing** - Foundation for everything else
2. **Add CI/CD** - Automate quality checks
3. **Setup Git Hooks** - Prevent bad commits
4. **Documentation** - Enable team collaboration
5. **Clean CLAUDE.md** - Improve agent efficiency
6. **Agent Skills** - Maximize AI productivity
7. **Production Readiness** - Prepare for deployment
8. **Template Cleanup** - Final polish

---

## Notes for Implementing Agent

- Run `bun install` before starting
- Use `bun dev` to verify changes work
- Check Biome errors with `bun biome check apps/web/src`
- Do NOT run global `bun check` (memory issues)
- Prefer editing existing files over creating new ones
- Follow existing patterns in /docs/claude/
- Test each phase before moving to next

---

*Generated: 2026-01-18*
*For: Claude Code Agent*
