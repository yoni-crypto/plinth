# Contributing to Plinth

Thank you for your interest in contributing to Plinth! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/plinth.git
cd plinth

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Start development
pnpm dev
```

## Code Style

- Use TypeScript with strict mode
- Follow the existing code patterns
- Run `pnpm lint` and `pnpm typecheck` before committing
- Use conventional commits (`feat:`, `fix:`, `chore:`, etc.)

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass (`pnpm test`)
4. Request a review

## Reporting Issues

- Use the GitHub issue tracker
- Include reproduction steps
- Include your environment info

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
