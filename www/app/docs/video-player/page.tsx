import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { VideoPlayerPreview, VideoPlayerAspectPreview, VideoPlayerNoSrcPreview } from '@/components/stepwise/docs/video-player-preview'

const basicCode = `import { VideoPlayer } from '@/components/stepwise/video-player'

<VideoPlayer
  src="/your-video.mp4"
  className="w-full max-w-xl"
/>`

const aspectCode = `<VideoPlayer
  src="/your-video.mp4"
  aspectRatio="9/16"
  className="w-full max-w-[240px]"
/>`

const noSrcCode = `<VideoPlayer className="w-full max-w-sm" />`

const toc = [
  { id: 'default',    label: 'Default',       child: false },
  { id: 'aspect',     label: 'Aspect ratio', child: false },
  { id: 'no-source',  label: 'No source',   child: false },
  { id: 'props',      label: 'Props',       child: false },
]

export default function VideoPlayerPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Video Player</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A fully custom HTML5 video player with a live <strong className="font-semibold text-zinc-700 dark:text-zinc-200">edge ambilight</strong> —
            colours along the frame’s perimeter bloom out behind the squircle, shifting with the
            picture. HugeIcons controls, a thin line volume control, and a bar that
            fades in on hover and auto-hides after 2.5s.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add video-player" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Pick a clip and hit play. Hover the speaker for volume;
            hover or drag the bar to see the time.
          </Text>
          <PreviewCode
            minHeight={620}
            allowOverflow
            overflowVisible
            preview={<VideoPlayerPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="aspect" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Aspect ratio</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Set the frame with{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">aspectRatio</code>
            {' '}— CSS form (<code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">16/9</code>)
            or colon form (<code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">16:9</code>).
            Custom accepts any valid CSS ratio.
          </Text>
          <PreviewCode
            minHeight={640}
            allowOverflow
            overflowVisible
            preview={<VideoPlayerAspectPreview />}
            code={<CodeBlock code={aspectCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="no-source" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">No source</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Renders a placeholder when no{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">src</code>{' '}
            is provided — useful for skeleton states during data loading.
          </Text>
          <PreviewCode
            minHeight={300}
            preview={<VideoPlayerNoSrcPreview />}
            code={<CodeBlock code={noSrcCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'src',              type: 'string',  desc: 'Video URL. Shows a placeholder when omitted.' },
            { name: 'poster',           type: 'string',  desc: 'Thumbnail shown before the video plays.' },
            { name: 'autoPlay',         type: 'boolean', desc: 'Start playback on load. Default false.' },
            { name: 'loop',             type: 'boolean', desc: 'Loop playback. Default false.' },
            { name: 'radius',           type: 'number',  desc: 'Corner radius (squircle-smoothed). Default 24.' },
            { name: 'ambient',          type: 'boolean', desc: 'Edge-sampled ambilight behind the player. Default true.' },
            { name: 'aspectRatio',      type: 'string',  desc: 'Frame ratio (`16/9` or `16:9`). Default 16/9. Any CSS ratio works for custom.' },
            { name: 'className',        type: 'string',  desc: 'Applied to the outer container. Use it to set width.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
