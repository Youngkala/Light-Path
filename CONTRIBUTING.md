# Contributing to LightPath

Thank you for your interest in contributing to LightPath! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a community around spiritual growth and technology.

## Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm
- Git
- MySQL/TiDB database

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Light-Path.git
   cd Light-Path
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/Youngkala/Light-Path.git
   ```

4. Install dependencies:
   ```bash
   pnpm install
   ```

5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the App

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm build
```

### Database Changes

If you modify the database schema:

1. Update `drizzle/schema.ts`
2. Generate migration:
   ```bash
   pnpm drizzle-kit generate
   ```
3. Review the generated SQL in `drizzle/migrations/`
4. Apply migration:
   ```bash
   pnpm drizzle-kit migrate
   ```

### Adding New Features

1. **Create database schema** (if needed)
   - Update `drizzle/schema.ts`
   - Generate and apply migrations

2. **Add database helpers**
   - Create query functions in `server/db.ts`

3. **Create tRPC procedures**
   - Add procedures to `server/routers.ts`
   - Use `protectedProcedure` for authenticated endpoints

4. **Build frontend**
   - Create page in `client/src/pages/`
   - Create components in `client/src/components/`
   - Use tRPC hooks: `trpc.*.useQuery()` / `trpc.*.useMutation()`

5. **Write tests**
   - Create test file: `server/feature.test.ts`
   - Use Vitest framework
   - Aim for >80% coverage

6. **Update documentation**
   - Update README.md if needed
   - Add code comments for complex logic

### Code Style

#### TypeScript
- Use strict mode
- Add explicit type annotations for function parameters
- Avoid `any` types

#### React
- Use functional components with hooks
- Follow React best practices
- Use `useCallback` for stable references
- Avoid unnecessary re-renders

#### Database
- Use Drizzle ORM for all queries
- Follow naming conventions: camelCase for columns
- Add proper indexes for performance

#### Styling
- Use Tailwind CSS utilities
- Follow the design system (colors, spacing, typography)
- Mobile-first responsive design

### Testing

Write tests for:
- API endpoints (tRPC procedures)
- Database queries
- Complex business logic
- Authentication flows

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/prayers.test.ts

# Run with coverage
pnpm test:coverage
```

## Commit Guidelines

Use clear, descriptive commit messages:

```
feat: Add Bible verse search functionality
fix: Correct prayer deletion bug
docs: Update README with API documentation
style: Format code with prettier
test: Add tests for dream interpreter
refactor: Simplify authentication flow
```

### Format
```
<type>: <subject>

<body>

<footer>
```

- **type**: feat, fix, docs, style, test, refactor, chore
- **subject**: Imperative, present tense, no period
- **body**: Explain what and why, not how
- **footer**: Reference issues: Closes #123

## Pull Request Process

1. **Before submitting:**
   - Ensure tests pass: `pnpm test`
   - Run linter: `pnpm lint`
   - Update documentation
   - Rebase on latest `main`

2. **Create pull request:**
   - Use descriptive title
   - Reference related issues
   - Describe changes and rationale
   - Include screenshots for UI changes

3. **PR description template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   How to test the changes

   ## Checklist
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No breaking changes
   - [ ] Code follows style guide
   ```

4. **Review process:**
   - Address reviewer feedback
   - Keep commits clean
   - Rebase if needed

## Feature Ideas

### High Priority
- [ ] Verse commentary and cross-references
- [ ] Bible reading plans
- [ ] Prayer reminders
- [ ] Offline support

### Medium Priority
- [ ] Community features
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Multi-language support

### Low Priority
- [ ] Mobile app
- [ ] Audio Bible
- [ ] AR features
- [ ] VR meditation

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Browser/device info
- Error messages/logs

### Feature Requests
Include:
- Clear description
- Use case/motivation
- Proposed implementation (optional)
- Related issues

## Documentation

### Code Comments
```typescript
// Use JSDoc for functions
/**
 * Search across prayers, Bible verses, and devotionals
 * @param userId - User ID for prayer filtering
 * @param query - Search query string
 * @returns Object with prayers, bibleVerses, and devotionals arrays
 */
export async function globalSearch(userId: number, query: string) {
  // ...
}
```

### README Updates
- Keep it current
- Add examples for new features
- Update troubleshooting section
- Document new dependencies

## Performance Considerations

- Optimize database queries (use indexes)
- Lazy load components
- Cache frequently accessed data
- Minimize bundle size
- Use pagination for large datasets

## Security

- Never commit secrets/credentials
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines

## Questions?

- Check existing issues and discussions
- Review documentation
- Ask in pull request comments
- Open a discussion thread

---

Thank you for contributing to LightPath! Your efforts help make spiritual growth technology better for everyone.
