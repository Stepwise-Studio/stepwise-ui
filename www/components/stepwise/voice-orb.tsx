'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { cn } from '@/lib/utils/cn'

export type VoiceOrbVariant = 'azure' | 'violet' | 'aurora' | 'ember' | 'pearl'

export interface VoiceOrbProps {
  /** Color palette and motion character. Default "azure". */
  variant?  : VoiceOrbVariant
  /** Diameter in px. Default 200. */
  size?     : number
  /**
   * 0–1 amplitude. When set, this is the source of truth (your own RMS / VAD).
   * Omit it to let `listen`, `audio`, or `amplitudeRef` drive the grains.
   */
  level?    : number
  /**
   * Mutable 0–1 amplitude ref — updated every frame without re-rendering.
   * Preferred for TTS / animation loops.
   */
  amplitudeRef?: RefObject<number>
  /** Capture the microphone and react to the user speaking. */
  listen?   : boolean
  /** Analyse AI playback — pass the <audio>/<video> or its MediaStream. */
  audio?    : HTMLMediaElement | MediaStream | null
  className?: string
}

type RGB = [number, number, number]

interface Motif {
  colors : [RGB, RGB, RGB]
  count  : number
  wander : number
  spinY  : number
  spinX  : number
  wave   : number
  tilt   : number
}

/*
 * Dotted globe (Thinking Orbs language) with color, sand wander, and voice.
 * Amplitude gently breathes the sphere — slow attack, slower release, no jitter.
 */
const MOTIFS: Record<VoiceOrbVariant, Motif> = {
  azure:  { colors: [[36,108,220],[58,148,242],[140,198,255]], count: 1.00, wander: 0.028, spinY: 0.22, spinX: 0.08, wave: 0.00, tilt: 0.32 },
  violet: { colors: [[92,36,172],[138,62,218],[198,128,246]],  count: 0.92, wander: 0.022, spinY: 0.18, spinX: 0.14, wave: 0.00, tilt: 0.55 },
  aurora: { colors: [[16,112,104],[36,168,148],[86,214,176]],  count: 1.05, wander: 0.034, spinY: 0.16, spinX: 0.06, wave: 0.11, tilt: 0.22 },
  ember:  { colors: [[186,52,34],[228,98,48],[255,158,88]],    count: 1.10, wander: 0.048, spinY: 0.20, spinX: 0.10, wave: 0.04, tilt: 0.40 },
  pearl:  { colors: [[108,118,138],[158,168,186],[208,214,224]], count: 0.72, wander: 0.016, spinY: 0.12, spinX: 0.05, wave: 0.00, tilt: 0.18 },
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5))

type Grain = { x: number; y: number; z: number; seed: number }

function fibonacciSphere(n: number): Grain[] {
  const pts: Grain[] = []
  const m = Math.max(2, n - 1)
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / m) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const t = GOLDEN * i
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r, seed: i * 1.618 })
  }
  return pts
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const k = Math.min(1, Math.max(0, t))
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ]
}

function rgb(c: RGB, a: number) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Voice-weighted level from analyser — soft gate, gentle compression. */
function voiceLevelFromAnalyser(
  analyser: AnalyserNode,
  freqBuf: Uint8Array<ArrayBuffer>,
  timeBuf: Uint8Array<ArrayBuffer>,
) {
  analyser.getByteFrequencyData(freqBuf)

  let sum = 0
  let weight = 0
  for (let i = 4; i < 30; i++) {
    const w = 1 - Math.abs(i - 14) / 18
    sum += (freqBuf[i] / 255) ** 2 * w
    weight += w
  }
  const band = weight > 0 ? Math.sqrt(sum / weight) : 0

  analyser.getByteTimeDomainData(timeBuf)
  let rmsSum = 0
  for (let i = 0; i < timeBuf.length; i++) {
    const n = (timeBuf[i] - 128) / 128
    rmsSum += n * n
  }
  const rms = Math.sqrt(rmsSum / timeBuf.length)

  const raw = band * 0.72 + rms * 0.28
  const gated = Math.max(0, raw - 0.045)
  return Math.min(1, Math.pow(gated * 1.85, 0.72))
}

function envelopeStep(current: number, target: number, attack: number, release: number) {
  const rate = target > current ? attack : release
  return current + (target - current) * rate
}

export function VoiceOrb({
  variant = 'azure',
  size = 200,
  level,
  amplitudeRef,
  listen = false,
  audio = null,
  className,
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ampRef = useRef(0)
  const smoothRef = useRef(0)
  const levelRef = useRef<number | undefined>(level)
  const amplitudeRefProp = amplitudeRef
  levelRef.current = level
  const motif = MOTIFS[variant]

  useEffect(() => {
    if (level != null || amplitudeRefProp) return
    if (!listen && !audio) {
      ampRef.current = 0
      return
    }

    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.84
    const freqBuf = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    const timeBuf = new Uint8Array(new ArrayBuffer(analyser.fftSize))
    const nodes: AudioNode[] = []
    let stream: MediaStream | null = null
    let raf = 0
    let alive = true

    const pump = () => {
      if (!alive) return
      const target = voiceLevelFromAnalyser(analyser, freqBuf, timeBuf)
      ampRef.current = envelopeStep(ampRef.current, target, 0.14, 0.045)
      raf = requestAnimationFrame(pump)
    }

    const connectStream = (s: MediaStream) => {
      const src = ctx.createMediaStreamSource(s)
      src.connect(analyser)
      nodes.push(src)
    }

    const boot = async () => {
      try {
        await ctx.resume()
        if (listen) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          })
          if (!alive) {
            stream.getTracks().forEach(t => t.stop())
            return
          }
          connectStream(stream)
        } else if (audio instanceof MediaStream) {
          connectStream(audio)
        } else if (audio) {
          try {
            const src = ctx.createMediaElementSource(audio)
            src.connect(analyser)
            src.connect(ctx.destination)
            nodes.push(src)
          } catch {
            // Element already wired into another graph — caller should pass `level` instead.
          }
        }
        pump()
      } catch {
        ampRef.current = 0
      }
    }

    void boot()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach(t => t.stop())
      nodes.forEach(n => n.disconnect())
      analyser.disconnect()
      void ctx.close()
    }
  }, [listen, audio, level, amplitudeRefProp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(size * dpr)
    canvas.width = w
    canvas.height = w

    const count = Math.round((220 + size * 2.15) * motif.count)
    const grains = fibonacciSphere(Math.min(900, count))
    const radius = size * 0.42 * dpr
    const cx = w / 2
    const cy = w / 2
    const [c0, c1, c2] = motif.colors
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const rot = (p: Grain, ax: number, ay: number) => {
      const cy_ = Math.cos(ay), sy = Math.sin(ay)
      let x = p.x * cy_ + p.z * sy
      let z = -p.x * sy + p.z * cy_
      const cx_ = Math.cos(ax), sx = Math.sin(ax)
      const y = p.y * cx_ - z * sx
      z = p.y * sx + z * cx_
      return { x, y, z, seed: p.seed }
    }

    const readLevel = () => {
      const external = amplitudeRefProp?.current
      if (external != null) return external
      if (levelRef.current != null) return levelRef.current
      return ampRef.current
    }

    const draw = (ms: number) => {
      const t = ms / 1000
      const raw = Math.min(1, Math.max(0, readLevel()))
      smoothRef.current = envelopeStep(smoothRef.current, raw, 0.09, 0.035)
      const L = smoothstep(smoothRef.current)
      ctx.clearRect(0, 0, w, w)

      const ay = t * motif.spinY * (1 + L * 0.06)
      const ax = motif.tilt + Math.sin(t * 0.17) * 0.08 + t * motif.spinX * 0.15
      const wander = motif.wander * (1 + L * 0.22)
      const wave = motif.wave + L * 0.028
      const breathe = 1 + L * 0.038
      const ripple = L * 0.009

      const drawn = grains.map(g => {
        const q = rot(g, ax, ay)
        const ox = Math.sin(t * 0.9 + g.seed * 2.1) * wander
        const oy = Math.cos(t * 0.7 + g.seed * 1.4) * wander
        const oz = Math.sin(t * 0.5 + g.seed * 3.0) * wander
        let x = q.x + ox
        let y = q.y + oy
          + Math.sin(q.x * 3.2 + t * 0.85) * wave
          + Math.sin(t * 3.8 + g.seed * 1.7) * ripple
        let z = q.z + oz
        const front = Math.max(0, z)
        const bulge = 1 + L * front * 0.055
        const len = Math.hypot(x, y, z) || 1
        x = (x / len) * breathe * bulge
        y = (y / len) * breathe * bulge
        z = (z / len) * breathe * bulge
        return { x, y, z }
      })

      drawn.sort((a, b) => a.z - b.z)

      for (const p of drawn) {
        const depth = p.z * 0.5 + 0.5
        const sx = cx + p.x * radius
        const sy = cy + p.y * radius
        const limb = Math.hypot(p.x, p.y)
        const rim = limb > 0.82 ? (limb - 0.82) / 0.18 : 0
        const a = (0.18 + 0.82 * depth ** 1.2) * (0.88 + rim * 0.28) * (0.94 + L * 0.08)
        const r = (0.55 + 1.25 * depth) * dpr * Math.max(0.75, size / 200) * (1 + L * 0.1)
        const col = depth < 0.62
          ? mix(c0, c1, depth / 0.62)
          : mix(c1, c2, (depth - 0.62) / 0.38)
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = rgb(col, a)
        ctx.fill()
      }
    }

    let raf = 0
    const loop = (ms: number) => {
      draw(ms)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (reduce || raf) return
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    if (reduce) draw(0)
    else start()

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else stop()
    }, { threshold: 0 })
    io.observe(canvas)

    const onVis = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [variant, size, motif])

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Voice orb — ${variant}`}
    >
      <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden />
    </div>
  )
}
