'use client'

import { Accordion } from '@/components/stepwise/accordion'

const FAQ_ITEMS = [
  {
    id: 'what',
    title: 'What is Stepwise UI?',
    content: 'Stepwise UI is a collection of production-ready components built with React, TypeScript, and Tailwind v4. Each component is designed with smooth corners, fluid motion, and a dark/light mode-aware design system.',
  },
  {
    id: 'install',
    title: 'How do I install a component?',
    content: 'Run npx stepwise-ui add <component-name> from your project root. This copies the component source and any peer dependencies directly into your codebase — no runtime package lock-in.',
  },
  {
    id: 'deps',
    title: 'What are the peer dependencies?',
    content: 'The core components require React 18+, motion/react for animations, and @lisse/react for squircle surfaces. Tailwind v4 is used for styling.',
  },
  {
    id: 'dark',
    title: 'Does it support dark mode?',
    content: 'Yes. All components are designed for both light and dark themes. The design system uses Tailwind\'s class-based dark mode with a ThemeProvider and view transition circular expand animation.',
  },
]

export function AccordionBasicPreview() {
  return (
    <div className="w-full max-w-lg">
      <Accordion items={FAQ_ITEMS} />
    </div>
  )
}

export function AccordionMultiplePreview() {
  return (
    <div className="w-full max-w-lg">
      <Accordion items={FAQ_ITEMS.slice(0, 3)} multiple />
    </div>
  )
}
