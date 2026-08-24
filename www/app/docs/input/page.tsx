import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { InputVariantPreview } from '@/components/stepwise/docs/input-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

/* ─── component source shown in the Code tab ─────────────────────────────── */
const componentCode = `'use client'

import { useState, useRef, useId, useCallback, useLayoutEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Sms, Profile, Lock1, Eye, EyeSlash } from 'iconsax-react'
import { cn } from '@/lib/utils/cn'

export type InputVariant = 'text' | 'name' | 'email' | 'username' | 'password'

const DEFAULT_LABELS: Record<InputVariant, string> = {
  text: 'Text', name: 'Full Name', email: 'Email Address',
  username: 'Username', password: 'Password',
}

const DEFAULT_PLACEHOLDERS: Record<InputVariant, string> = {
  text: '', name: 'e.g. Ada Lovelace', email: 'name@example.com',
  username: 'your_username', password: '',
}

function validate(variant: InputVariant, value: string): string | null {
  if (!value) return null
  switch (variant) {
    case 'email':
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
        ? null : 'Please enter a valid email address.'
    case 'username':
      return /^[a-zA-Z0-9_]+$/.test(value)
        ? null : 'Only letters, numbers, and underscores allowed.'
    case 'password':
      return value.length >= 8 ? null : 'Password must be at least 8 characters.'
    default: return null
  }
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  variant?: InputVariant
  label?: string
  showIcon?: boolean
  iconSide?: 'left' | 'right'
  icon?: React.ReactNode
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { variant = 'text', label, showIcon = true, iconSide = 'left', icon: customIcon,
    error: externalError, hint, className, value, defaultValue, disabled,
    placeholder, onChange, onFocus, onBlur, ...props }, ref,
) => {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue != null ? String(defaultValue) : '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [shakeCount, setShakeCount] = useState(0)
  const borderRef = useRef<HTMLDivElement>(null)
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? String(value ?? '') : internalValue
  const errorMsg = externalError ?? validationError
  const hasError = Boolean(errorMsg)

  const defaultIcon = variant !== 'text' ? <VariantIcon variant={variant} /> : null
  const iconNode = customIcon !== undefined ? customIcon : defaultIcon
  const effectiveIcon = showIcon ? iconNode : null
  const hasLeftIcon = Boolean(effectiveIcon) && iconSide === 'left'
  const hasRightIcon = Boolean(effectiveIcon) && iconSide === 'right'

  const resolvedLabel = label === undefined ? DEFAULT_LABELS[variant] : label
  const resolvedPlaceholder = placeholder ?? DEFAULT_PLACEHOLDERS[variant]

  useLayoutEffect(() => {
    if (shakeCount === 0) return
    const el = borderRef.current
    if (!el) return
    el.classList.remove('input-shaking')
    void el.offsetWidth
    el.classList.add('input-shaking')
    const t = setTimeout(() => el.classList.remove('input-shaking'), 320)
    return () => clearTimeout(t)
  }, [shakeCount])

  const triggerShake = useCallback((msg: string) => {
    setValidationError(msg)
    setShakeCount(c => c + 1)
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
    revertTimerRef.current = setTimeout(() => {
      setValidationError(null); revertTimerRef.current = null
    }, 3300)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value)
    if (validationError) {
      setValidationError(null)
      if (revertTimerRef.current) { clearTimeout(revertTimerRef.current); revertTimerRef.current = null }
    }
    onChange?.(e)
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(false)
    if (!externalError && currentValue) {
      const err = validate(variant, currentValue)
      if (err) triggerShake(err)
    }
    onBlur?.(e)
  }

  const inputType = variant === 'password' ? (showPassword ? 'text' : 'password') : 'text'
  const inputPl = hasLeftIcon ? '42px' : '14px'
  const inputPr = (hasRightIcon || variant === 'password') ? '44px' : '14px'

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {resolvedLabel && (
        <label htmlFor={id} className={cn(
          'text-[13px] font-medium leading-none select-none pl-[2px] transition-colors duration-150',
          hasError ? 'text-red-500 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400',
        )}>
          {resolvedLabel}
        </label>
      )}

      <div ref={borderRef} className="relative w-full h-11">
        {/* Surface / border handled by your design system */}
        <div className={cn(
          'relative h-11 w-full rounded-xl border transition-colors duration-150',
          'bg-white dark:bg-zinc-900',
          disabled ? 'opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-800'
            : hasError ? 'border-red-400 dark:border-red-500 cursor-text'
            : focused  ? 'border-zinc-700 dark:border-zinc-300 cursor-text'
            : 'border-zinc-200 dark:border-zinc-800 cursor-text',
        )}>
          {hasLeftIcon && (
            <div aria-hidden className="absolute left-[13px] top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {effectiveIcon}
            </div>
          )}
          {hasRightIcon && (
            <div aria-hidden className="absolute right-[13px] top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {effectiveIcon}
            </div>
          )}
          {variant === 'password' && (
            <button type="button" tabIndex={-1} onClick={() => setShowPassword(p => !p)}
              className="absolute right-[7px] top-1/2 -translate-y-1/2 w-[34px] h-[34px]
                flex items-center justify-center rounded-lg
                text-zinc-400 dark:text-zinc-500
                hover:text-zinc-600 dark:hover:text-zinc-300
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                transition-[color,background-color,transform] duration-150 active:scale-[0.96]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={showPassword ? 'hide' : 'show'}
                  initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
                  exit={{    opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  className="flex items-center justify-center"
                >
                  {showPassword
                    ? <EyeSlash size={17} variant="Linear" color="currentColor" />
                    : <Eye      size={17} variant="Linear" color="currentColor" />}
                </motion.span>
              </AnimatePresence>
            </button>
          )}
          <input ref={ref} id={id} type={inputType}
            value={isControlled ? value : internalValue}
            disabled={disabled} placeholder={resolvedPlaceholder}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e) }}
            onBlur={handleBlur}
            className={cn(
              'absolute inset-0 w-full h-full bg-transparent outline-none',
              'text-[15px] tracking-[-0.03em] text-zinc-900 dark:text-zinc-100',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              'disabled:cursor-not-allowed',
            )}
            style={{ paddingLeft: inputPl, paddingRight: inputPr }}
            {...props}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {(errorMsg || hint) && (
          <motion.p key={errorMsg ? 'error' : 'hint'}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className={cn('text-[12px] pl-[2px] leading-snug tracking-[-0.01em]',
              errorMsg ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500')}
          >
            {errorMsg ?? hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})
Input.displayName = 'Input'`

/* ─── usage examples ─────────────────────────────────────────────────────── */
const usageCode = `import { Input } from '@/components/stepwise/input'

// Basic — each variant ships with a sensible default label and placeholder
<Input variant="name" />
<Input variant="email" />
<Input variant="username" />
<Input variant="password" />
<Input variant="text" label="Bio" placeholder="Tell us about yourself" />

// Custom label
<Input variant="email" label="Work Email" />

// Custom placeholder
<Input variant="name" placeholder="First name only" />

// Icon control — suppress or move the icon
<Input variant="name" showIcon={false} />
<Input variant="email" iconSide="right" />

// External error (server / form library)
<Input variant="email" error="That email is already taken." />

// Hint text
<Input variant="username" hint="Letters, numbers, and underscores only." />

// Disabled
<Input variant="name" defaultValue="Ada Lovelace" disabled />`

/* ─── TOC ────────────────────────────────────────────────────────────────── */
const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'usage',   label: 'Usage',   child: false },
  { id: 'props',   label: 'Props',   child: false },
]

/* ─── page ──────────────────────────────────────────────────────────────── */
export default async function InputPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Input</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A text field with five built-in variants — name, email, username, password,
            and plain text. Each ships with its own icon, placeholder, blur validation,
            and an error-shake animation.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add input" />
        </section>

        {/* Preview + Code */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={440}
            preview={<InputVariantPreview />}
            code={<CodeBlock code={componentCode} className="rounded-none" flat />}
          />
        </section>

        {/* Usage — distinct from the Preview's code tab, which shows the
            component's own source rather than practical call sites */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
            Extends all native{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">{'<input>'}</code>{' '}
            props except{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">id</code>{' '}
            and{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">type</code>{' '}
            (managed internally). Works as both controlled and uncontrolled.
          </Text>

          <PropsTable rows={[
            { name: 'variant',     type: '"text" | "name" | "email" | "username" | "password"', desc: 'Controls input type, default label, default placeholder, built-in icon, and blur validation. Default: "text".' },
            { name: 'label',       type: 'string',           desc: 'Label shown above the field. Omit to use the variant default (e.g. "Full Name"). Pass an empty string to hide the label entirely.' },
            { name: 'placeholder', type: 'string',           desc: 'Placeholder text inside the field. Omit to use the variant default (e.g. "name@example.com" for email).' },
            { name: 'showIcon',    type: 'boolean',          desc: 'Show or hide the variant\'s built-in icon. Default: true for all named variants. Always false for "text".' },
            { name: 'iconSide',    type: '"left" | "right"', desc: 'Which side to place the icon. Default: "left". The password eye-toggle is always on the right regardless.' },
            { name: 'icon',        type: 'ReactNode',        desc: 'Custom icon node — replaces the variant default while respecting showIcon and iconSide.' },
            { name: 'error',       type: 'string',           desc: 'External error message (from a server or form library). Overrides built-in validation and triggers the shake animation.' },
            { name: 'hint',        type: 'string',           desc: 'Helper text shown below the field. Hidden when an error is active.' },
            { name: 'disabled',    type: 'boolean',          desc: 'Dims the field and blocks all interaction.' },
            { name: 'className',   type: 'string',           desc: 'Applied to the outer flex wrapper — useful for controlling width or margin.' },
          ]} />
        </section>

      </div>

      {/* On this page */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
