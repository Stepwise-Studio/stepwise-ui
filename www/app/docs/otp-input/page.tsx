import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { OtpStandalonePreview, OtpErrorPreview, OtpSecurityPreview, OtpLengthsPreview } from '@/components/stepwise/docs/drawer-otp-preview'

const basicCode = `import { OtpInput } from '@/components/stepwise/otp-input'

const [otp, setOtp] = useState('')

<OtpInput length={6} value={otp} onChange={setOtp} />`

const securityCode = `// letters + digits, auto-uppercased - a security / redemption code
<OtpInput type="alphanumeric" length={6} value={code} onChange={setCode} />`

const lengthsCode = `<OtpInput length={4} />                        // 4-digit PIN
<OtpInput type="alphanumeric" length={8} />    // 8-char code`

const errorCode = `<OtpInput length={6} value={otp} onChange={setOtp} error />`

const toc = [
  { id: 'default',    label: 'Default',         child: false },
  { id: 'security', label: 'Security code',  child: false },
  { id: 'lengths',  label: 'Lengths',        child: false },
  { id: 'error',    label: 'Error',          child: false },
  { id: 'props',    label: 'Props',          child: false },
]

export default function OtpInputPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">OTP Input</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A row of individual digit boxes for one-time codes. Auto-advances on entry,
            steps back on Backspace, handles paste, and navigates with arrow keys.
            Best used inside a bottom{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">Drawer</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add otp-input" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={220}
            preview={<OtpStandalonePreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="security" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Security code</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Set <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">type=&quot;alphanumeric&quot;</code> to accept letters and digits (auto-uppercased) - for security or redemption codes like <span className="font-mono">7F3K9Q</span>.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<OtpSecurityPreview />}
            code={<CodeBlock code={securityCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="lengths" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Lengths</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Any length via <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">length</code> - a 4-digit PIN, an 8-character code, whatever you need.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<OtpLengthsPreview />}
            code={<CodeBlock code={lengthsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="error" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Error state</Text>
          <PreviewCode
            minHeight={200}
            preview={<OtpErrorPreview />}
            code={<CodeBlock code={errorCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'length',    type: 'number',                desc: 'Number of boxes. Default 6 - any length.' },
            { name: 'type',      type: '"numeric" | "alphanumeric"', desc: 'Digits only (default), or letters + digits.' },
            { name: 'value',     type: 'string',                desc: 'Controlled value.' },
            { name: 'onChange',  type: '(value: string) => void', desc: 'Fires with the full digit string on every change.' },
            { name: 'error',     type: 'boolean',               desc: 'Red ring on all boxes.' },
            { name: 'disabled',  type: 'boolean',               desc: 'Disables all inputs.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
