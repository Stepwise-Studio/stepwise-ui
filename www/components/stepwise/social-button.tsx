'use client'

import { ButtonHTMLAttributes } from 'react'
import { Button, type ButtonSize } from './button'

export type SocialProvider = 'google' | 'github' | 'apple'

export interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** One of the built-in providers, or any other string for a custom provider. */
  provider  : SocialProvider | (string & {})
  /**
   * Required when `provider` is not one of the built-in ones. `label` is also
   * required then, since there is no built-in name to phrase the button with.
   */
  icon?     : React.ReactNode
  label?    : string
  size?     : ButtonSize
  fullWidth?: boolean
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const GitHubLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91-.83 0-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.91 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53 1.24-.05 1.74-.81 3.26-.81 1.52 0 1.96.81 3.26.78 1.34-.02 2.22-1.24 3.04-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.6-4.04z"/>
  </svg>
)

const logos: Record<'google' | 'github' | 'apple', React.ReactNode> = {
  google: <GoogleLogo />,
  github: <GitHubLogo />,
  apple:  <AppleLogo />,
}

const names: Record<'google' | 'github' | 'apple', string> = {
  google: 'Google',
  github: 'GitHub',
  apple:  'Apple',
}

function isBuiltIn(p: string): p is 'google' | 'github' | 'apple' {
  return p === 'google' || p === 'github' || p === 'apple'
}

export function SocialButton({
  provider,
  icon,
  label,
  size      = 'lg',
  fullWidth = true,
  ...props
}: SocialButtonProps) {
  const builtIn = isBuiltIn(provider)

  // globalThis rather than a bare `process`, which would need @types/node to
  // typecheck in projects that don't already have it.
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
  if (nodeEnv !== 'production' && !builtIn && (!icon || !label)) {
    console.warn(`[Stepwise SocialButton] provider="${provider}" isn't built in - pass both \`icon\` and \`label\` explicitly.`)
  }

  return (
    <Button
      variant="outline"
      size={size}
      icon={icon ?? (builtIn ? logos[provider] : null)}
      iconPosition="left"
      fullWidth={fullWidth}
      {...props}
    >
      {label ?? (builtIn ? `Continue with ${names[provider]}` : provider)}
    </Button>
  )
}
