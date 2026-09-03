# Social Button

A sign-in button carrying the provider logo and a sensible default label.

## Install

```bash
npx stepwise-ui add social-button
```

Exports: `SocialButton`

## Usage

```tsx
import { SocialButton } from '@/components/stepwise/social-button'

<SocialButton provider="google" />
<SocialButton provider="github" label="Sign in with GitHub" />
<SocialButton provider="apple"  label="Sign up with Apple" />
```

## What gets written

- `components/stepwise/social-button.tsx`

Also installs: [button](https://ui.stepwise.studio/docs/button.md)

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/social-button
Whole library as text: https://ui.stepwise.studio/llms.txt
