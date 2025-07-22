# Contributing to Maestro

Thank you for your interest in contributing to Maestro! This document provides guidelines and information for contributors.

## 🎯 What We're Looking For

We welcome contributions in the following areas:

- **Bug Fixes**: Help us squash bugs and improve stability
- **Feature Enhancements**: Add new capabilities to the adaptive music system
- **Documentation**: Improve guides, examples, and API documentation
- **Performance**: Optimize existing functionality
- **Testing**: Add tests and improve test coverage
- **Examples**: Create compelling use cases and demos

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git
- TypeScript knowledge (for code contributions)

### Development Setup

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/maestro.git
   cd maestro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up development environment**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npx ts-node src/testMaestro.ts
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript with proper type annotations
- **Formatting**: Follow existing code style and indentation
- **Naming**: Use descriptive, camelCase names for variables and functions
- **Comments**: Add JSDoc comments for public APIs and complex logic

### Architecture Principles

- **Modularity**: Keep components focused and loosely coupled
- **Type Safety**: Leverage TypeScript's type system for better code quality
- **Performance**: Consider performance implications of changes
- **Compatibility**: Maintain backward compatibility when possible

### File Structure

```
src/
├── index.ts              # Main exports (public API)
├── types.ts              # TypeScript type definitions
├── useImuse.ts           # React hook implementation
├── transport.ts          # Musical timing system
├── scheduler.ts          # Cue and layer management
├── transition.ts         # Transition orchestration
├── toriiListeners.ts     # Blockchain integration
└── testMaestro.ts        # Example usage and tests
```

## 🧪 Testing

### Running Tests

```bash
# Run the main test example
npx ts-node src/testMaestro.ts

# Build and check for TypeScript errors
npm run build

# Lint the codebase
npm run lint
```

### Writing Tests

- Add tests for new functionality
- Include edge cases and error conditions
- Test both success and failure scenarios
- Use descriptive test names

### Test Example

```typescript
// Example test structure
describe("Transition Manager", () => {
  it("should schedule transitions with bar synchronization", () => {
    const transport = createTransport(120, 480);
    const scheduler = createScheduler();
    const transitionManager = createTransitionManager(transport, scheduler);

    // Test implementation
  });
});
```

## 📚 Documentation

### API Documentation

- Update JSDoc comments for any API changes
- Include parameter descriptions and return types
- Provide usage examples for complex functions
- Document breaking changes clearly

### README Updates

- Update installation instructions if dependencies change
- Add new examples for new features
- Update API reference when interfaces change
- Include migration guides for breaking changes

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes**

   ```bash
   npm run build
   npm run lint
   npx ts-node src/testMaestro.ts
   ```

2. **Update documentation**

   - Update README.md if needed
   - Add JSDoc comments for new APIs
   - Update examples if behavior changes

3. **Check for breaking changes**
   - If breaking changes are necessary, document them clearly
   - Consider providing migration guides

### Creating a Pull Request

1. **Create a descriptive title**

   - Use conventional commit format: `feat: add new transition type`
   - Be specific about what the PR accomplishes

2. **Write a detailed description**

   ```markdown
   ## What does this PR do?

   Brief description of the changes

   ## Why is this change needed?

   Explanation of the problem or enhancement

   ## How does it work?

   Technical details of the implementation

   ## Testing

   How to test the changes

   ## Breaking Changes

   Any breaking changes and migration steps
   ```

3. **Include examples**
   - Code examples showing the new functionality
   - Before/after comparisons if applicable

### Review Process

- All PRs require at least one review
- Address review comments promptly
- Update the PR based on feedback
- Ensure CI checks pass

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues for duplicates
2. Try the latest version of Maestro
3. Reproduce the issue in a minimal example

### Bug Report Template

````markdown
## Bug Description

Clear description of the issue

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- Maestro version:
- Node.js version:
- Operating system:
- Browser (if applicable):

## Code Example

```typescript
// Minimal code to reproduce the issue
```
````

## Additional Context

Any other relevant information

````

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Consider if it fits Maestro's scope
3. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why this feature is needed and how it would be used

## Proposed Implementation
Optional: thoughts on how to implement

## Alternatives Considered
Other approaches that were considered

## Additional Context
Any other relevant information
````

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Ask questions in PR reviews

## 🎉 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to Maestro! 🎵
