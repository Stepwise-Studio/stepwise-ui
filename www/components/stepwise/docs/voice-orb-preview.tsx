'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { VoiceOrb, type VoiceOrbVariant } from '@/components/stepwise/voice-orb'
import { Button } from '@/components/stepwise/button'
import { cn } from '@/lib/utils/cn'

const VARIANTS: { key: VoiceOrbVariant; label: string; hint: string }[] = [
  { key: 'azure',  label: 'Azure',  hint: 'Slow globe' },
  { key: 'violet', label: 'Violet', hint: 'Tilted orbits' },
  { key: 'aurora', label: 'Aurora', hint: 'Latitude waves' },
  { key: 'ember',  label: 'Ember',  hint: 'Sand drift' },
  { key: 'pearl',  label: 'Pearl',  hint: 'Sparse idle' },
]

const DEFAULT_SPEECH =
  "Hello — I'm your AI assistant. Type anything here and I'll read it aloud while the orb follows along."

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang.startsWith('en') && v.localService) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0] ??
    null
  )
}

export function VoiceOrbShowcase() {
  const [active, setActive] = useState<VoiceOrbVariant>('azure')
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <VoiceOrb variant={active} size={200} />
      <div className="flex flex-wrap justify-center gap-2">
        {VARIANTS.map(v => (
          <button
            key={v.key}
            onClick={() => setActive(v.key)}
            className={
              'px-3.5 h-9 rounded-full text-[13px] font-medium transition-colors duration-150 active:scale-[0.96] ' +
              (active === v.key
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700')
            }
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function VoiceOrbGrid() {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8 place-items-center py-2">
      {VARIANTS.map(v => (
        <div key={v.key} className="flex flex-col items-center gap-3">
          <VoiceOrb variant={v.key} size={116} />
          <div className="text-center">
            <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200">{v.label}</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{v.hint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function VoiceOrbLive() {
  const [mode, setMode] = useState<'idle' | 'listen' | 'speak'>('idle')
  const [text, setText] = useState(DEFAULT_SPEECH)
  const [reading, setReading] = useState(false)
  const [ttsReady, setTtsReady] = useState(false)
  const amplitudeRef = useRef(0)
  const impulseRef = useRef(0)
  const activeRef = useRef(false)
  const rafRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const sync = () => setTtsReady(window.speechSynthesis.getVoices().length > 0)
    sync()
    window.speechSynthesis.addEventListener('voiceschanged', sync)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', sync)
  }, [])

  const tick = useCallback(() => {
    impulseRef.current *= 0.86
    const base = activeRef.current ? 0.2 : 0
    const micro = activeRef.current
      ? 0.07 * (0.5 + 0.5 * Math.sin(performance.now() * 0.011))
      : 0
    amplitudeRef.current = Math.min(1, base + impulseRef.current + micro)
    if (activeRef.current || amplitudeRef.current > 0.02) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      amplitudeRef.current = 0
    }
  }, [])

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel()
    activeRef.current = false
    impulseRef.current = 0
    setReading(false)
  }, [])

  const readAloud = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || typeof window === 'undefined' || !window.speechSynthesis) return

    stopSpeech()
    setMode('speak')

    const utterance = new SpeechSynthesisUtterance(trimmed)
    utterance.rate = 0.96
    utterance.pitch = 1
    const voice = pickVoice()
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      activeRef.current = true
      impulseRef.current = 0.5
      setReading(true)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    utterance.onboundary = e => {
      if (e.name === 'word' || e.name === 'sentence') {
        impulseRef.current = Math.max(impulseRef.current, 0.32 + Math.random() * 0.28)
      }
    }

    utterance.onend = () => {
      activeRef.current = false
      impulseRef.current = 0.12
      setReading(false)
    }

    utterance.onerror = () => {
      activeRef.current = false
      impulseRef.current = 0
      setReading(false)
    }

    window.speechSynthesis.speak(utterance)
    window.speechSynthesis.resume()
  }, [text, stopSpeech, tick])

  useEffect(() => {
    if (mode !== 'speak') {
      stopSpeech()
      amplitudeRef.current = 0
    }
  }, [mode, stopSpeech])

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current)
    window.speechSynthesis?.cancel()
  }, [])

  const btn = (id: 'idle' | 'listen' | 'speak', label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setMode(id)}
      className={
        'h-9 rounded-full px-3.5 text-[13px] font-medium transition-colors duration-150 active:scale-[0.96] ' +
        (mode === id
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700')
      }
    >
      {label}
    </button>
  )

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <VoiceOrb
        variant="azure"
        size={200}
        listen={mode === 'listen'}
        amplitudeRef={mode === 'speak' ? amplitudeRef : undefined}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {btn('idle', 'Idle')}
        {btn('listen', 'Listen')}
        {btn('speak', 'Speak')}
      </div>

      {mode === 'speak' && (
        <div className="flex w-full max-w-md flex-col gap-3">
          <label htmlFor="voice-orb-speech" className="sr-only">
            Text to read aloud
          </label>
          <textarea
            id="voice-orb-speech"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            placeholder="Type something for the orb to read…"
            className={cn(
              'w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3',
              'text-[14px] leading-relaxed text-zinc-800 placeholder:text-zinc-400',
              'outline-none transition-[border-color,box-shadow] duration-150',
              'focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/8',
              'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
              'dark:focus:border-zinc-600 dark:focus:ring-white/10',
            )}
          />
          <div className="flex gap-2">
            <Button
              variant="solid"
              className="flex-1"
              onClick={readAloud}
              disabled={!text.trim() || !ttsReady}
            >
              {reading ? 'Reading…' : 'Read aloud'}
            </Button>
            {reading && (
              <Button variant="outline" onClick={stopSpeech}>
                Stop
              </Button>
            )}
          </div>
        </div>
      )}

      <p className="max-w-sm text-center text-[12px] text-zinc-400 dark:text-zinc-500">
        {mode === 'listen' && 'Microphone on — the orb breathes with your voice, softly.'}
        {mode === 'speak' && 'Uses your browser voice — type a message and hit Read aloud.'}
        {mode === 'idle' && 'Resting globe. Listen uses the mic; Speak reads text aloud.'}
      </p>
    </div>
  )
}
