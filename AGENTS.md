# Repository Guidelines

## Project Structure & Module Organization
- `index.html` and `index.tsx` are the Vite entry points; `App.tsx` holds the main UI and view logic.
- `services/` contains API integrations (e.g., `services/geminiService.ts` for Gemini calls).
- `constants.ts` stores static data (symptom lists, labels, character metadata); `types.ts` defines shared TypeScript types.
- `vite.config.ts` centralizes dev server and environment wiring; `metadata.json` describes the app.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server (configured for port 3000 and `0.0.0.0`).
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- Configure `GEMINI_API_KEY` in `.env.local` before running; it is injected via `vite.config.ts`.

## Coding Style & Naming Conventions
- TypeScript + React with the automatic JSX runtime (`jsx: react-jsx`).
- Follow the existing style: 2-space indentation, components in `PascalCase`, functions/variables in `camelCase`.
- Constants use `UPPER_SNAKE_CASE` in `constants.ts`.
- Keep file naming aligned with current patterns (e.g., `App.tsx`, `index.tsx`, `geminiService.ts`).
- Use the `@/` alias (root) when imports improve clarity.

## Testing Guidelines
- No test runner is configured in `package.json` yet.
- If you add tests, document the runner and scripts, and prefer `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines
- This copy is not a Git repository, so no commit conventions are detectable.
- Recommended: short, present-tense messages (e.g., `feat: add symptom filter`, `fix: guard empty analysis`).
- PRs should include a brief summary, test/verification steps, and screenshots for UI changes.

## Security & Configuration Tips
- Never commit `.env.local`; rotate keys if exposed.
- Keep API keys out of client code beyond the Vite-injected env path used in `vite.config.ts`.
