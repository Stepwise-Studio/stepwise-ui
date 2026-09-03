# Video Player

A fully custom HTML5 video player with a live edge ambilight - colours along the frame’s perimeter bloom out behind the squircle, shifting with the picture.

## Install

```bash
npx stepwise-ui add video-player
```

Exports: `VideoPlayer`

## Usage

```tsx
import { VideoPlayer } from '@/components/stepwise/video-player'

<VideoPlayer
  src="/your-video.mp4"
  className="w-full max-w-xl"
/>
```

## What gets written

- `components/stepwise/video-player.tsx`
- `lib/utils/cn.ts`

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/video-player
Whole library as text: https://ui.stepwise.studio/llms.txt
