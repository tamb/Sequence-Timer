# GitHub Copilot Instructions

## Project Technologies
- Vite (build tool)
- Vitest (testing framework)
- Bun (runtime/package manager)
- Lit (web components)
- TypeScript
- Bootstrap 5 (CSS classes)

## Coding Guidelines
- Use TypeScript for all source files.
- Use Lit for web components. Always use the `LitElement` base class and use best practives for Lit development.
- Use TypeScript for all components and functions.
- Use TypeScript for all tests.
- Use Bootstrap 5 classes for styling.
- Use Vite for development and builds.
- Use Vitest for all tests.
- Use Bun for package management and scripts.
- Use the `src/` directory for all source code.
- Use the `src/` directory as context always.
- Use best practices for code organization and structure.
- Follow consistent naming conventions for files and components.
- Use biome for code formatting and linting.
- Write appropriate comments and documentation for complex logic.
- Ensure all components are reusable and modular.
- Use TypeScript interfaces and types for component properties and state. Interfaces should be defined with an "I" prefix (e.g., `ITimerProps`).
- Use `@ts-ignore` sparingly and only when absolutely necessary, with a comment explaining why it is needed.
- Use `@ts-expect-error` for expected TypeScript errors, with a comment explaining the reason.
- Typescript types should be named with a `T` prefix (e.g., `TTimer`).
- Write unit tests for all components and functions.
- Use mobile-first design principles.
- Apply your changes to the codebase and ensure they are consistent with the existing code style. Then check the work and fix errors.  Fix the errors first before checking so you're not stuck in a loop. Apply the code changes for refactors and edits in place so they are not creating duplicate code all over. We don't want you to add a change without removing the old code first.  If you are adding a new feature, then you can add the new code and then remove the old code after the new code is working.
- Use `biome` for code formatting and linting. Run `bunx biome format . --write` to format code and `bunx biome lint .` to lint code.
- Use `bunx` to run scripts defined in `package.json`.
- Use `bun` commands for package management (e.g., `bun add`, `bun remove`, `bun install`).
- Use `vite` commands for development and builds (e.g., `vite dev`, `vite build`, `vite preview`).
- Use `vitest` commands for running tests (e.g., `vitest run`, `vitest watch`).
- Add minimal logging but do so when necessary.

## Context
- Always use and reference code from the `src/` directory for implementation and examples. Treat the entire project as a Progressive Web App that should allow for installation and should be able to run these timers and alarms in the background if possible.  This is a webapp that should a progressive web app you can install.  It's purpose is to manage multiple timers, allowing users to add, edit, and delete timers, and organize them into sets.

## Prompts
- When generating code, always prefer TypeScript and Lit syntax.
- For UI, use Bootstrap 5 classes.
- For tests, use Vitest syntax and conventions.
- For package management, use Bun commands.
- For build and dev server, use Vite commands.

---
These instructions are for Copilot and other AI coding assistants to ensure consistent code generation and project context awareness.
