'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/stepwise/button'
import { Toggle } from '@/components/stepwise/toggle'
import { Checkbox } from '@/components/stepwise/checkbox'
import { Radio } from '@/components/stepwise/radio'
import { Chip } from '@/components/stepwise/chip'
import { Segment } from '@/components/stepwise/segment'
import { Slider } from '@/components/stepwise/slider'
import { AvatarGroup } from '@/components/stepwise/avatar'
import { Spinner } from '@/components/stepwise/spinner'
import { ColorPicker } from '@/components/stepwise/color-picker'
import { OtpInput } from '@/components/stepwise/otp-input'
import { QtyInput } from '@/components/stepwise/qty-input'
import { Select } from '@/components/stepwise/select'
import { Multiselect } from '@/components/stepwise/multiselect'
import { Combobox } from '@/components/stepwise/combobox'
import { Pagination } from '@/components/stepwise/pagination'
import { Breadcrumbs } from '@/components/stepwise/breadcrumbs'
import { Accordion } from '@/components/stepwise/accordion'
import { SocialButton } from '@/components/stepwise/social-button'
import { Input } from '@/components/stepwise/input'
import { TimePicker } from '@/components/stepwise/time-picker'
import { ShimmerText } from '@/components/stepwise/shimmer-text'
import { SquigglyUnderline } from '@/components/stepwise/squiggly-underline'
import { ScrambleText } from '@/components/stepwise/scramble-text'
import { Typewriter } from '@/components/stepwise/typewriter'
import { FlowerLoader } from '@/components/stepwise/flower-loader'
import { VoiceOrb } from '@/components/stepwise/voice-orb'
import { Tooltip } from '@/components/stepwise/tooltip'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { ProfileCard } from '@/components/stepwise/profile-card'
import { Modal } from '@/components/stepwise/modal'
import { toast, Toaster } from '@/components/stepwise/toast'

function RadioDemo() {
  const name = useId()
  return (
    <div className="flex flex-col gap-2.5">
      <Radio name={name} defaultChecked label="Weekly" />
      <Radio name={name} label="Monthly" />
      <Radio name={name} label="Yearly" />
    </div>
  )
}

function PaginationDemo() {
  const [page, setPage] = useState(2)
  return <Pagination page={page} totalPages={8} onChange={setPage} />
}

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="soft" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete workspace"
        description="This will permanently delete your workspace and all its data."
        variant="destructive"
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

function MultiselectDemo() {
  const [val, setVal] = useState<string[]>(['react'])
  return (
    <Multiselect
      placeholder="Pick stack"
      options={[
        { value: 'react', label: 'React' },
        { value: 'next', label: 'Next.js' },
        { value: 'ts', label: 'TypeScript' },
        { value: 'tailwind', label: 'Tailwind' },
      ]}
      value={val}
      onChange={setVal}
    />
  )
}

function ComboboxDemo() {
  const [val, setVal] = useState('')
  return (
    <Combobox
      placeholder="Search country…"
      options={[
        { value: 'us', label: 'United States' },
        { value: 'in', label: 'India' },
        { value: 'de', label: 'Germany' },
        { value: 'jp', label: 'Japan' },
      ]}
      value={val}
      onChange={setVal}
    />
  )
}

/* ── curated list: one of each comp, ordered by visual magnetism ─────── */
const ITEMS: { node: React.ReactNode; w?: string }[] = [
  { node: <VoiceOrb variant="azure" size={120} />, w: 'w-[200px]' },
  { node: <ColorPicker value="#8b5cf6" /> },
  { node: <ProfileCard name="Akhil Reji" verified role="Design Engineer" stats={[{ label: 'Components', value: '50+' }, { label: 'Stars', value: '1.2k' }]} />, w: 'w-[260px]' },
  { node: <FlowerLoader size={80} /> },
  { node: <div className="flex gap-3 items-center"><Spinner size={36} /><Spinner status="success" size={36} /><Spinner status="error" size={36} /></div> },
  { node: <AvatarGroup max={4} avatars={[{ name: 'Akhil Reji' }, { name: 'Sarah Chen' }, { name: 'Marcus Wright' }, { name: 'Priya Nair' }, { name: 'Leo Kim' }]} /> },
  { node: <Toggle defaultChecked /> },
  { node: <OtpInput length={4} /> },
  { node: <QtyInput defaultValue={3} min={0} max={99} /> },
  { node: <Segment size="sm" defaultValue="grid" options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'row', label: 'Row' }]} />, w: 'w-[200px]' },
  { node: <Slider defaultValue={64} label="Volume" />, w: 'w-[200px]' },
  { node: <div className="flex flex-wrap gap-2"><Chip>Draft</Chip><Chip variant="solid" color="success">Live</Chip><Chip color="danger">Archived</Chip></div> },
  { node: <div className="flex flex-col gap-2"><Button size="sm">Get started</Button><Button size="sm" variant="soft">Learn more</Button><Button size="sm" variant="outline">View docs</Button></div> },
  { node: <Select placeholder="Framework" options={[{ value: 'next', label: 'Next.js' }, { value: 'remix', label: 'Remix' }, { value: 'astro', label: 'Astro' }]} />, w: 'w-[210px]' },
  { node: <MultiselectDemo />, w: 'w-[210px]' },
  { node: <ComboboxDemo />, w: 'w-[210px]' },
  { node: <div className="flex flex-col gap-2.5"><Checkbox defaultChecked label="Remember me" /><Checkbox label="Send digest" /></div> },
  { node: <RadioDemo /> },
  { node: <Accordion items={[{ id: 'a', title: 'What is Stepwise?', content: 'A squircle-first UI kit.' }, { id: 'b', title: 'Is it free?', content: 'Copy, paste, ship.' }, { id: 'c', title: 'Dark mode?', content: 'Always. Toggle above.' }]} />, w: 'w-[240px]' },
  { node: <PaginationDemo /> },
  { node: <Breadcrumbs items={[{ label: 'Home' }, { label: 'Docs' }, { label: 'Button' }]} /> },
  { node: <div className="flex flex-col gap-2"><SocialButton provider="google" /><SocialButton provider="github" /></div>, w: 'w-[200px]' },
  { node: <Input variant="email" label="Email" placeholder="you@stepwise.dev" />, w: 'w-[210px]' },
  { node: <TimePicker label="Standup" value="09:30" />, w: 'w-[200px]' },
  { node: <Tooltip content="Squircles, always"><Button size="sm" variant="outline">Hover me</Button></Tooltip> },
  { node: <ModalDemo /> },
  { node: <Button size="sm" variant="soft" onClick={() => toast.success('Changes saved!')}>Show toast</Button> },
  { node: <Typewriter words={['Design systems.', 'Squircle corners.', 'Ship faster.']} className="text-[17px] font-medium text-zinc-700 dark:text-zinc-300" /> },
  { node: <ShimmerText className="text-[20px] font-semibold">Generating…</ShimmerText> },
  { node: <SquigglyUnderline><span className="text-[20px] font-semibold text-zinc-800 dark:text-zinc-100">handcrafted</span></SquigglyUnderline> },
  { node: <ScrambleText className="text-[20px] font-semibold text-zinc-800 dark:text-zinc-100">Stepwise UI</ScrambleText> },
  { node: <ThemeToggle /> },
]

export function HomeCanvas() {
  return (
    <section className="w-full border-t border-zinc-200/70 dark:border-zinc-800/70 py-10 px-6 md:px-10">
      <Toaster />
      {/* CSS columns: items take their natural sizes, packed tight, no dead space */}
      <div
        className="w-full"
        style={{ columnCount: 5, columnGap: '2rem', columnFill: 'balance' }}
      >
        {ITEMS.map(({ node, w }, i) => (
          <div
            key={i}
            className="mb-8 break-inside-avoid flex items-center justify-center"
            style={{ width: '100%' }}
          >
            <div className={w ?? 'w-fit'}>
              {node}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
