'use client'

import { SocialButton } from '@/components/stepwise/social-button'

export function SocialButtonProvidersPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SocialButton provider="google" />
      <SocialButton provider="github" label="Sign in with GitHub" />
      <SocialButton provider="apple" label="Sign up with Apple" />
    </div>
  )
}

export function SocialButtonCustomPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SocialButton
        provider="figma"
        label="Continue with Figma"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 24a3.5 3.5 0 0 0 3.5-3.5V17H8.5a3.5 3.5 0 1 0 0 7z" fill="#0ACF83" />
            <path d="M5 13.5A3.5 3.5 0 0 1 8.5 10H12v7H8.5A3.5 3.5 0 0 1 5 13.5z" fill="#A259FF" />
            <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3H12v7H8.5A3.5 3.5 0 0 1 5 6.5z" fill="#F24E1E" />
            <path d="M12 3h3.5a3.5 3.5 0 1 1 0 7H12V3z" fill="#FF7262" />
            <path d="M19 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" fill="#1ABCFE" />
          </svg>
        }
      />
      <SocialButton
        provider="slack"
        label="Continue with Slack"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.04 15.17a2.53 2.53 0 1 1-2.52-2.53h2.52v2.53zm1.27 0a2.53 2.53 0 0 1 5.05 0v6.3a2.53 2.53 0 0 1-5.05 0v-6.3z" fill="#E01E5A" />
            <path d="M8.83 5.04a2.53 2.53 0 1 1 2.53-2.52v2.52H8.83zm0 1.27a2.53 2.53 0 0 1 0 5.05h-6.3a2.53 2.53 0 0 1 0-5.05h6.3z" fill="#36C5F0" />
            <path d="M18.96 8.83a2.53 2.53 0 1 1 2.52 2.53h-2.52V8.83zm-1.27 0a2.53 2.53 0 0 1-5.05 0v-6.3a2.53 2.53 0 0 1 5.05 0v6.3z" fill="#2EB67D" />
            <path d="M15.17 18.96a2.53 2.53 0 1 1-2.53 2.52v-2.52h2.53zm0-1.27a2.53 2.53 0 0 1 0-5.05h6.3a2.53 2.53 0 0 1 0 5.05h-6.3z" fill="#ECB22E" />
          </svg>
        }
      />
    </div>
  )
}
