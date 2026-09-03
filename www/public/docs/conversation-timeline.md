# Conversation Timeline

A dense rail of thin marks, one per message, that expands into a labelled list on hover.

## Install

```bash
npx stepwise-ui add conversation-timeline
```

Exports: `ConversationTimeline`

## Usage

```tsx
import { ConversationTimeline } from '@/components/stepwise/conversation-timeline'

const checkpoints = [
  { id: '1', role: 'system',    label: 'System prompt' },
  { id: '2', role: 'user',      label: 'Can you help me set up auth?' },
  { id: '3', role: 'assistant', label: 'Of course - let me walk you through it' },
]

const [activeId, setActiveId] = useState('2')

<ConversationTimeline
  checkpoints={checkpoints}
  activeId={activeId}
  onSelect={setActiveId}
/>
```

## What gets written

- `components/stepwise/conversation-timeline.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/conversation-timeline
Whole library as text: https://ui.stepwise.studio/llms.txt
