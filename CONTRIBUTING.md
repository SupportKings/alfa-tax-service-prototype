# Contributing to Template-2025

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- **Bun 1.2.13+** - This project requires Bun as the package manager
- **Node.js 20+** - For compatibility with some tools
- **Git** - For version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/template-2025.git
   cd template-2025
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/template-2025.git
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cp apps/web/.env.example apps/web/.env
   cp apps/server/.env.example apps/server/.env
   ```

3. **Start development servers**:
   ```bash
   bun dev
   ```

4. **Verify setup**:
   - Web app: http://localhost:3001
   - Server: http://localhost:4000
   - Email preview: http://localhost:3002

## Branch Naming

Use the following prefixes for branch names:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/user-authentication` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `docs/` | Documentation changes | `docs/api-reference` |
| `refactor/` | Code refactoring | `refactor/auth-module` |
| `test/` | Test additions/updates | `test/user-service` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated by commitlint.

### Format

```
type(scope): description

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Other changes |
| `revert` | Revert a previous commit |

### Examples

```bash
# Feature
git commit -m "feat(auth): add email OTP verification"

# Bug fix
git commit -m "fix(dashboard): resolve sidebar collapse issue"

# Documentation
git commit -m "docs(api): update authentication endpoints"
```

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes** following code standards

3. **Run quality checks**:
   ```bash
   bunx biome check .
   bun check-types
   bun test:unit
   ```

4. **Push your branch**:
   ```bash
   git push origin feature/your-feature
   ```

5. **Open a Pull Request** on GitHub with:
   - Clear title following commit conventions
   - Description of changes
   - Screenshots (if UI changes)
   - Reference to related issues

6. **Address review feedback** and update as needed

7. **Merge** once approved and CI passes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] All CI checks pass
- [ ] PR description is complete

## Code Standards

### TypeScript

- Use strict TypeScript - no `any` types
- Prefer interfaces over type aliases
- Use proper types from existing definitions

### React Components

- Server Components by default
- Only use `'use client'` when necessary
- Follow existing patterns in `/features/`

### Formatting

- Biome handles formatting and linting
- Tabs for indentation
- Double quotes for strings
- Semicolons required

### Imports

Import order (auto-organized by Biome):
1. React/Next
2. Node built-ins
3. External packages
4. Internal packages
5. Components
6. Features
7. Local files

## Testing Requirements

### Unit Tests

- Add tests for new features
- Update tests for bug fixes
- Maintain 80% coverage target

### Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test:coverage

# Run E2E tests
bun test:e2e
```

### Test Structure

```
/tests
├── unit/           # Unit tests
│   └── components/
├── integration/    # Integration tests
│   └── features/
└── utils/          # Test utilities
```

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas

Thank you for contributing!
