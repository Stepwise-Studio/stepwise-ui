# Otp Input

A row of individual digit boxes for one-time codes.

## Install

```bash
npx stepwise-ui add otp-input
```

Exports: `OtpInput`

## Usage

```tsx
import { OtpInput } from '@/components/stepwise/otp-input'

const [otp, setOtp] = useState('')

<OtpInput length={6} value={otp} onChange={setOtp} />
```

## What gets written

- `components/stepwise/otp-input.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/otp-input
Whole library as text: https://ui.stepwise.studio/llms.txt
