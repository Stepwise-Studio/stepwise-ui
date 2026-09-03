# stepwise-ui

CLI for [Stepwise UI](https://ui.stepwise.studio) - copies component source into your
project so you own it outright. No runtime package, no version lock, no wrapper
around someone else's abstraction.

```bash
npx stepwise-ui init
```

## Commands

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

### `list`

Every available component, grouped by category.

```bash
npx stepwise-ui list
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

A few components (`breadcrumbs`, `product-card`, `profile-card`) use `next/link`
and `next/image` and therefore need Next.js. The CLI tells you when a component
needs something your project doesn't have - it never installs a framework for
you.

## Pointing at a different registry

```bash
STEPWISE_REGISTRY_URL=http://localhost:3000/r npx stepwise-ui add button
```

Useful when working on the registry itself.

## License

MIT
