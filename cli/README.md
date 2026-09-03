# stepwise-ui

CLI for [Stepwise UI](https://ui.stepwise.studio) - copies component source into your
project so you own it outright. No runtime package, no version lock, no wrapper
around someone else's abstraction.

```bash
npx stepwise-ui init
```

## Using this from a coding agent

An agent arriving here first should read
**[llms.txt](https://ui.stepwise.studio/llms.txt)** - the whole library in one
request, every component with its exports and a usage example, so you can pick a
real component instead of writing one from scratch.

Then use `add`, not `init`: `init` is an interactive picker and needs a TTY.
`add` never touches project config, so it is safe to run unattended.
[The Agents guide](https://ui.stepwise.studio/docs/agents) has the details,
including a drop-in `AGENTS.md` block.

## Commands

### `init`

Browse the registry and install what you pick, in one step. Search by name,
select what you want, and the source is written into your project.

```bash
npx stepwise-ui init
```

It also offers to set up the two things components need but cannot do for
themselves - the dark-mode variant and the `@/` path alias - and asks before
touching either file.

Needs a real terminal, since it is an interactive picker. In a script, CI or an
agent session use `add` instead, and `list --all` to see what is available.

### `add <components...>`

Copies one or more components into your project, follows their dependencies, and
installs any npm packages they need.

```bash
npx stepwise-ui add button                 # one component
npx stepwise-ui add button input select    # several at once
npx stepwise-ui add date-picker            # pulls in `calendar` automatically
npx stepwise-ui add button --yes           # overwrite files you've edited
```

Files land at the paths the component declares - `components/stepwise/…` for the
components themselves, `lib/utils/cn.ts` for the shared class helper.

A file that already exists and matches is left alone. A file you've since edited
is **not** overwritten unless you pass `--yes`, so local changes survive a
re-run.

### `list` (alias `ls`)

The Stepwise components already in this project, grouped by category. Add
`--all` for the full registry instead.

```bash
npx stepwise-ui list          # what this project already has
npx stepwise-ui list --all    # every component available
```

## Requirements

- Node 18+
- React 19
- Tailwind CSS v4
- An `@/*` path alias pointing at your project root:

  ```jsonc
  // tsconfig.json
  { "compilerOptions": { "paths": { "@/*": ["./*"] } } }
  ```

  Components import each other through this alias. The CLI warns if it's missing.

- A class-based dark variant in your global stylesheet:

  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```

  Dark mode is class-based, not `prefers-color-scheme`. Without this line every
  `dark:` class in every component silently does nothing - it is the single most
  common way a Stepwise install looks broken. `init` offers to add it; `add`
  warns when it is missing.

No component imports from `next/*`, so none of this is tied to Next.js - it
works in Vite, Remix, or plain React. The CLI tells you when a component needs a
package your project doesn't have, and installs it. React itself is the
exception: that is a framework-level choice, so it is reported and left to you.

## Pointing at a different registry

```bash
STEPWISE_REGISTRY_URL=http://localhost:3000/r npx stepwise-ui add button
```

Useful when working on the registry itself.

## License

MIT
