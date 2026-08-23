import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { VoiceOrbShowcase, VoiceOrbGrid, VoiceOrbLive } from '@/components/stepwise/docs/voice-orb-preview'

const usageCode = `import { VoiceOrb } from '@/components/stepwise/voice-orb'

<VoiceOrb variant="azure" />
<VoiceOrb variant="aurora" size={260} />`

const liveCode = `// User speaking — orb analyses the microphone
<VoiceOrb listen />

// AI speaking — browser TTS + amplitudeRef synced to speech
const amp = useRef(0)
// bump amp.current on word boundaries while speechSynthesis speaks
<VoiceOrb amplitudeRef={amp} />

// Or wire your own Web Audio graph
<VoiceOrb audio={player} />
<VoiceOrb level={rms} />`

const variantsCode = `<VoiceOrb variant="azure" />
<VoiceOrb variant="violet" />
<VoiceOrb variant="aurora" />
<VoiceOrb variant="ember" />
<VoiceOrb variant="pearl" />`

const tocItems = [
  { id: 'preview',      label: 'Preview',      child: false },
  { id: 'live',         label: 'Live',         child: false },
  { id: 'variants',     label: 'Variants',     child: false },
  { id: 'installation', label: 'Installation', child: false },
  { id: 'usage',        label: 'Usage',        child: false },
  { id: 'props',        label: 'Props',        child: false },
]

export default function VoiceOrbPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Voice Orb</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A dotted 3D sphere for voice and agent UIs — grains on a globe, depth-sorted, slowly
            tumbling. Inspired by Jakub Antalík’s Thinking Orbs; evolved with color, sand-grain
            wander, and optional voice reactivity.
          </Text>
        </div>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={480}
            preview={<VoiceOrbShowcase />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="live" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Live</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Grains follow amplitude. <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">listen</code> uses
            the microphone; <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Speak</code> reads
            your text aloud via the browser and drives the orb from speech events.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<VoiceOrbLive />}
            code={<CodeBlock code={liveCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Variants</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Same sphere language, five palettes — each with its own tilt, spin, and grain.
          </Text>
          <PreviewCode
            minHeight={420}
            preview={<VoiceOrbGrid />}
            code={<CodeBlock code={variantsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="installation" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add voice-orb" />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',   type: '"azure" | "violet" | "aurora" | "ember" | "pearl"', desc: 'Palette and motion character. Default "azure".' },
            { name: 'size',      type: 'number', desc: 'Diameter in px. Default 200.' },
            { name: 'listen',    type: 'boolean', desc: 'Capture the microphone and react to the user speaking.' },
            { name: 'audio',     type: 'HTMLMediaElement | MediaStream | null', desc: 'Analyse AI playback. Prefer level if the element is already in a Web Audio graph.' },
            { name: 'level',     type: 'number', desc: '0–1 amplitude. Wins over listen/audio when set — use your own RMS/VAD.' },
            { name: 'amplitudeRef', type: 'RefObject<number>', desc: 'Mutable 0–1 ref updated each frame — preferred for TTS loops without re-renders.' },
            { name: 'className', type: 'string', desc: 'Extra classes on the wrapper.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
