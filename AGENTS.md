# Stepwise UI

Monorepo for [Stepwise UI](https://ui.stepwise.studio): a React component
library distributed as source rather than as a package.

## Layout

| Path   | What it is                                                        |
| ------ | ----------------------------------------------------------------- |
| `www/` | Next.js 16 site - docs, marketing, and the component registry      |
| `cli/` | `stepwise-ui` - the npm package users run via `npx`                |

`www/AGENTS.md` carries a rule that matters: this is Next.js 16, and its
conventions differ from older versions. Read `www/node_modules/next/dist/docs/`
before writing Next-specific code rather than relying on memory.

## How distribution works

Two artifacts, two destinations, and they are not the same thing:

- **`cli/`** is published to npm as `stepwise-ui`. Users never install it as a
  dependency - `npx` fetches and discards it per run.
- **The components** are never packaged. They are served as JSON from
  `ui.stepwise.studio/r/*.json` and written into the user's repo by the CLI.

The CLI has `https://ui.stepwise.studio/r` hardcoded as its default registry,
so **the site must be deployed before the CLI is published**. Publishing first
means every `npx stepwise-ui add` 404s.

## Registry

`www/public/r/*.json` is generated, never hand-edited.

```
npm run registry:gen     # scan components -> www/registry/index.ts
npm run registry:check   # validate
npm run registry:build   # gen + check + write public/r/*.json
```

`registry:build` runs automatically via `prebuild`, so `next build` always
emits a current registry. It also prunes manifests for deleted components -
without that step a removed component stays installable indefinitely.

Two fields in each manifest are derived, not authored:

- `exports` - parsed from the component source, so agents can learn that
  `frame` also exports `FrameHeader` without downloading the file.
- `example` - lifted from the component's docs page, so there is one copy of
  each snippet rather than two that drift apart.

Adding a component means adding its source and its docs page; the registry
picks both up on the next build.

## Conventions

- **Squircles, not `border-radius`.** Rounded surfaces use `@lisse/react`
  through the local `Surface` primitive at `smoothing: 0.6`. A plain
  `rounded-*` class is a bug, not a shortcut.
- **Dark mode is class-based.** `@custom-variant dark (&:where(.dark, .dark *))`
  in `globals.css`, not `prefers-color-scheme`.
- **`{' '}` after inline elements** in docs prose. JSX drops a trailing space
  before a line wrap, which silently renders `npm updateyour way`.
- Components are plain React. Nothing may depend on Next.js.

## Before shipping

```
cd www && npx next build      # also regenerates the registry
cd cli && npm run build
```

Test the CLI against a local registry rather than production:

```
STEPWISE_REGISTRY_URL=http://localhost:3000/r node cli/dist/index.js add button
```

`init` is an interactive picker, so it cannot be driven from a normal shell
call. Exercise it through a pty, or test `add` and `list --all`, which cover
the same code paths without a prompt.

`init` also offers to add the dark-mode variant and the `@/` alias, asking
first. Accepting the alias offer rewrites `tsconfig.json` as plain JSON, which
drops comments, so the prompt warns when the file actually has any. `add` never
touches project config, because it runs unattended.
