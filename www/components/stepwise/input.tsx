'use client'

import { useState, useRef, useId, useCallback, useLayoutEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  UserIcon, MailIcon, AtIcon, LockIcon, ViewIcon, ViewOffIcon,
} from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export type InputVariant = 'text' | 'name' | 'email' | 'username' | 'password'

const ICON_SIZE   = 18
const SW_DEFAULT  = 1.5
const SW_ACTIVE   = 2.0

const DEFAULT_LABELS: Record<InputVariant, string> = {
  text:     'Text',
  name:     'Full Name',
  email:    'Email Address',
  username: 'Username',
  password: 'Password',
}

const DEFAULT_PLACEHOLDERS: Record<InputVariant, string> = {
  text:     '',
  name:     'Dragon warrior',
  email:    'name@example.com',
  username: 'your_username',
  password: '',
}

function VariantIcon({ variant, strokeWidth }: { variant: InputVariant; strokeWidth: number }) {
  const p = { size: ICON_SIZE, strokeWidth, color: 'currentColor' }
  if (variant === 'name')     return <HugeiconsIcon icon={UserIcon}  {...p} />
  if (variant === 'email')    return <HugeiconsIcon icon={MailIcon}   {...p} />
  if (variant === 'username') return <HugeiconsIcon icon={AtIcon}     {...p} />
  if (variant === 'password') return <HugeiconsIcon icon={LockIcon}   {...p} />
  return null
}

function validate(variant: InputVariant, value: string): string | null {
  if (!value) return null
  switch (variant) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? null : 'Please enter a valid email address.'
    case 'username':
      return /^[a-zA-Z0-9_]+$/.test(value)
        ? null : 'Only letters, numbers, and underscores allowed.'
    case 'password':
      return value.length >= 8 ? null : 'Must be at least 8 characters.'
    default:
      return null
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
  {
    variant = 'text',
    label,
    showIcon = true,
    iconSide = 'left',
    icon: customIcon,
    error: externalError,
    hint,
    className,
    value,
    defaultValue,
    disabled,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) => {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const id = useId()
  const [focused,       setFocused]       = useState(false)
  const [showPassword,  setShowPassword]  = useState(false)
  const [internalValue, setInternalValue] = useState(
    defaultValue != null ? String(defaultValue) : '',
  )
  const [validationError, setValidationError] = useState<string | null>(null)
  const [shakeCount,      setShakeCount]      = useState(0)

  const borderRef      = useRef<HTMLDivElement>(null)
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? String(value ?? '') : internalValue
  const errorMsg     = externalError ?? validationError
  const hasError     = Boolean(errorMsg)

  const strokeWidth = focused ? SW_ACTIVE : SW_DEFAULT

  const defaultIcon   = variant !== 'text' ? <VariantIcon variant={variant} strokeWidth={strokeWidth} /> : null
  const iconNode      = customIcon !== undefined ? customIcon : defaultIcon
  const effectiveIcon = showIcon ? iconNode : null
  const hasLeftIcon   = Boolean(effectiveIcon) && iconSide === 'left'
  const hasRightIcon  = Boolean(effectiveIcon) && iconSide === 'right'

  const resolvedLabel       = label === undefined ? DEFAULT_LABELS[variant] : label
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
      setValidationError(null)
      revertTimerRef.current = null
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

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(true)
    onFocus?.(e)
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
  const inputMode = variant === 'email' ? 'email' : undefined

  const inputPl = hasLeftIcon  ? '42px' : '14px'
  const inputPr = (hasRightIcon || variant === 'password') ? '44px' : '14px'

  const borderColor = disabled
    ? (dark ? '#27272a' : '#e4e4e7')
    : hasError
      ? (dark ? '#ef4444' : '#f87171')
      : focused
        ? (dark ? '#d4d4d8' : '#3f3f46')
        : (dark ? '#27272a' : '#e4e4e7')

  // Password-specific hint: real-time color based on length (no need for blur)
  const passwordHintText =
    variant === 'password'
      ? (hint ?? 'Must be at least 8 characters.')
      : hint

  const passwordHintColor =
    variant === 'password' && currentValue.length > 0
      ? currentValue.length >= 8
        ? 'text-emerald-500 dark:text-emerald-400'
        : 'text-red-500 dark:text-red-400'
      : 'text-zinc-400 dark:text-zinc-500'

  // For non-password variants, the hint below the field
  const belowText  = errorMsg ?? (variant === 'password' ? null : hint)
  const belowColor = errorMsg
    ? 'text-red-500 dark:text-red-400'
    : 'text-zinc-400 dark:text-zinc-500'

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {resolvedLabel && (
        <label
          htmlFor={id}
          className={cn(
            'text-[13px] tracking-[-0.01em] font-medium leading-none select-none pl-[2px]',
            'transition-colors duration-150',
            hasError
              ? 'text-red-500 dark:text-red-400'
              : focused
                ? 'text-zinc-800 dark:text-zinc-100'
                : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {resolvedLabel}
        </label>
      )}

      {/* group — drives eye visibility and icon stroke hover */}
      <div ref={borderRef} className="group relative w-full h-11">
        <Surface
          radius={18}
          className={cn(
            'relative h-11 w-full bg-white dark:bg-zinc-900',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
          )}
        >
          {/* Left icon */}
          {hasLeftIcon && (
            <div
              aria-hidden
              className={cn(
                'absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none',
                '[&_svg]:transition-[stroke-width,color] [&_svg]:duration-200',
                hasError
                  ? 'text-red-500 dark:text-red-400'
                  : focused
                    ? 'text-zinc-600 dark:text-zinc-300'
                    : 'text-zinc-400 dark:text-zinc-500',
              )}
            >
              {effectiveIcon}
            </div>
          )}

          {/* Right icon */}
          {hasRightIcon && (
            <div
              aria-hidden
              className={cn(
                'absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none',
                '[&_svg]:transition-[stroke-width,color] [&_svg]:duration-200',
                hasError
                  ? 'text-red-500 dark:text-red-400'
                  : focused
                    ? 'text-zinc-600 dark:text-zinc-300'
                    : 'text-zinc-400 dark:text-zinc-500',
              )}
            >
              {effectiveIcon}
            </div>
          )}

          {/* Password toggle — z-10 so it's above the absolute input */}
          {variant === 'password' && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(p => !p)}
              className={cn(
                'absolute right-[7px] top-1/2 -translate-y-1/2 z-10 cursor-pointer',
                'w-[34px] h-[34px] flex items-center justify-center rounded-full',
                'text-zinc-400 dark:text-zinc-500',
                'hover:text-zinc-600 dark:hover:text-zinc-300',
                // visible on hover or when field is focused
                'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                'transition-[color,background-color,opacity] duration-150',
                'active:scale-[0.96]',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? 'hide' : 'show'}
                  initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
                  exit={{    opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.15, bounce: 0 }}
                  className="flex items-center justify-center"
                >
                  {showPassword
                    ? <HugeiconsIcon icon={ViewOffIcon} size={ICON_SIZE} strokeWidth={1.5} color="currentColor" />
                    : <HugeiconsIcon icon={ViewIcon}    size={ICON_SIZE} strokeWidth={1.5} color="currentColor" />
                  }
                </motion.span>
              </AnimatePresence>
            </button>
          )}

          {/* Native input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            inputMode={inputMode}
            value={isControlled ? value : internalValue}
            disabled={disabled}
            placeholder={resolvedPlaceholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'absolute inset-0 w-full h-full bg-transparent outline-none',
              'text-[15px] tracking-[-0.03em] text-zinc-900 dark:text-zinc-100',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              'disabled:cursor-not-allowed',
            )}
            style={{ paddingLeft: inputPl, paddingRight: inputPr, fontSize: inputType === 'password' ? '11px' : undefined }}
            {...props}
          />
        </Surface>

        {/* Border overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 18,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor,
            transition: 'border-color 350ms ease-in-out',
          }}
        />
      </div>

      {/* Password hint — always shown, color based on length */}
      {variant === 'password' && passwordHintText && (
        <p className={cn(
          'text-[12px] pl-[2px] tracking-normal leading-snug transition-colors duration-200',
          errorMsg ? 'text-red-500 dark:text-red-400' : passwordHintColor,
        )}>
          {errorMsg ?? passwordHintText}
        </p>
      )}

      {/* Non-password: error or hint, animated */}
      {variant !== 'password' && (
        <AnimatePresence mode="wait" initial={false}>
          {belowText && (
            <motion.p
              key={errorMsg ? 'error' : 'hint'}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              className={cn('text-[12px] pl-[2px] tracking-normal leading-snug', belowColor)}
            >
              {belowText}
            </motion.p>
          )}
        </AnimatePresence>
      )}
    </div>
  )
})

Input.displayName = 'Input'
