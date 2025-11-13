# Repository Guidelines

## Project Structure & Module Organization
Fastify boots from `src/server.ts`, autoloading everything in `src/routes/` so each route file should export a Fastify plugin that wires HTTP handlers to the domain modules in `src/module/`. Shared helpers, schemas, and adapters live in `src/common/`, `src/shared/`, and `src/types/`, while ingestable documents stay in `src/documents/`. The Redis, sensible, and support plugins sit under `src/plugins/` and are registered at startup. Tests mirror the runtime layout inside `test/`, compiled output lands in `dist/`, and container assets or compose files belong in `docker/`.

## Build, Test, and Development Commands
- `yarn dev`: Runs `tsx watch src/server.ts`, hot‑reloading TypeScript while printing Fastify logs.
- `yarn build`: Compiles TypeScript via `tsc`, emitting JS and source maps into `dist/`; run this before packaging or testing.
- `yarn start`: Launches the compiled server (`node dist/server.js`) for parity with production images.
- `yarn test`: Executes Node’s built‑in test runner over `dist/**/*.js` with `c8` coverage; ensure `yarn build` has been run or call `yarn build && yarn test`.

## Coding Style & Naming Conventions
Use TypeScript strictness inherited from `fastify-tsconfig` and keep files in ESM format. Prefer 2‑space indentation, `camelCase` for functions/variables, and `PascalCase` for classes or TypeBox schemas. Route plugins should be named `<feature>.route.ts`, export `async function routes(app)`, and use the TypeBox helpers in `src/shared/schemas`. Validate external inputs with Ajv (automatically configured) and keep side‑effectful utilities in `src/common/` instead of placing logic in route definitions.

## Testing Guidelines
Write tests with Node’s `node:test` API alongside helpers from `test/helper.ts`; mirror the source path (e.g., `src/module/moon-phase-data` → `test/module/moon-phase-data`). Name files `*.test.ts`, keep them deterministic, and rely on Redis test doubles or Dockerized Redis when needed. Coverage is enforced via `c8`, so include regression tests whenever you add routes, plugins, or schema changes. Run `yarn build && yarn test` locally before pushing to keep `dist/` synchronized with the TypeScript sources.

## Commit & Pull Request Guidelines
Follow the existing Conventional Commit style (`feat: ...`, `fix: ...`, `chore: ...`) visible in `git log` so release automation remains predictable. Each pull request should describe the feature or fix, link to tracking issues, list new environment variables, and attach screenshots or sample responses when API behavior changes. Mention required migrations (Redis index names, document keys, etc.) and confirm `yarn test` output; reviewers will block PRs missing this checklist.

## Configuration & Security Tips
Environment variables are loaded via `dotenv` inside `src/server.ts`; keep a `.env` file (uncommitted) defining `PORT`, `HOST`, and `REDIS_URL`. The Redis plugin (`src/plugins/redis.ts`) creates and aliases vector indexes on startup, so coordinate schema name changes with DevOps before merging. Avoid committing secrets, and prefer Docker overrides in `docker/` for production credentials. When adding new external services, document required firewall rules and timeouts directly in the PR to keep deployments reproducible.
