'use client'

import { useState } from 'react'
import { ConversationTimeline, type TimelineCheckpoint } from '@/components/stepwise/conversation-timeline'

const DEMO: TimelineCheckpoint[] = [
  { id: '1',  role: 'system',    label: 'System prompt' },
  { id: '2',  role: 'user',      label: 'Can you help me set up auth?' },
  { id: '3',  role: 'assistant', label: 'Of course - let me walk you through it' },
  { id: '4',  role: 'user',      label: 'What about the refresh-token edge case?' },
  { id: '5',  role: 'assistant', label: 'Great question. The key is rotation' },
  { id: '6',  role: 'user',      label: 'I see, but what if the tab is offline?' },
  { id: '7',  role: 'assistant', label: "Here's a working snippet for that" },
  { id: '8',  role: 'user',      label: 'Tried it - getting a 401 back' },
  { id: '9',  role: 'assistant', label: 'The issue is on the interceptor line' },
  { id: '10', role: 'user',      label: 'That fixed it, thank you!' },
  { id: '11', role: 'assistant', label: 'Happy to help. In summary…' },
  { id: '12', role: 'user',      label: 'One more thing - how do I handle logout?' },
  { id: '13', role: 'assistant', label: 'Clear the token and redirect to /login' },
  { id: '14', role: 'user',      label: 'Should I also clear it server-side?' },
  { id: '15', role: 'assistant', label: 'Yes - revoke the refresh token there too' },
  { id: '16', role: 'user',      label: 'Got it. What about multiple tabs?' },
  { id: '17', role: 'assistant', label: 'Broadcast a storage event to sync logout' },
  { id: '18', role: 'user',      label: 'Nice, that closes the loop nicely' },
  { id: '19', role: 'assistant', label: 'Anything else on auth before we wrap up?' },
  { id: '20', role: 'user',      label: 'Nope, this covers it. Thanks again!' },
]

export function ConversationTimelinePreview() {
  const [activeId, setActiveId] = useState('5')

  return (
    <div className="flex items-center justify-center py-4 text-zinc-400 dark:text-zinc-500">
      <ConversationTimeline
        checkpoints={DEMO}
        activeId={activeId}
        onSelect={setActiveId}
      />
    </div>
  )
}

export function ConversationTimelineLeftPreview() {
  const [activeId, setActiveId] = useState('3')

  return (
    <div className="flex items-center justify-end py-4 pr-6 text-zinc-400 dark:text-zinc-500">
      <ConversationTimeline
        checkpoints={DEMO.slice(0, 7)}
        activeId={activeId}
        onSelect={setActiveId}
        side="left"
        accent="#8b5cf6"
      />
    </div>
  )
}
