'use client'

import {
  useRef, useState, useEffect, useCallback, PointerEvent as ReactPointerEvent,
} from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SmoothCorners } from '@lisse/react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  FullScreenIcon, MinimizeScreenIcon, VolumeHighIcon, VolumeLowIcon, VolumeMute02Icon,
  PlayIcon, PauseIcon,
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'

const EASE = [0.22, 1, 0.36, 1] as const
// Icon swap recipe (better-ui #7): scale 0.25→1, opacity 0→1, blur 4px→0,
// spring with bounce always 0.
const ICON_SWAP_TRANSITION = { type: 'spring', duration: 0.3, bounce: 0 } as const

function fmt(s: number) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// Cross-fades between two HugeIcons glyphs in the same slot - used by play/
// pause, the fullscreen toggle, and the volume level indicator so every
// control-icon swap reads with the same craft.
function IconSwap({ id, icon, size = 16, strokeWidth = 1.8, filled, reduce }: {
  id: string, icon: IconSvgElement, size?: number, strokeWidth?: number, filled?: boolean, reduce: boolean | null
}) {
  return (
    <span className="relative grid place-items-center" style={{ width: size, height: size }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={id}
          className="absolute inset-0 grid place-items-center"
          initial={reduce ? false : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
          transition={reduce ? { duration: 0.1 } : ICON_SWAP_TRANSITION}
        >
          {/* Paths carry no fill of their own (pure stroke glyphs) - setting
              fill on the outer <svg> is what they inherit it from, so this is
              how play/pause reads as a solid "primary control" glyph while
              volume/fullscreen stay outline-only secondary controls. */}
          <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} color="currentColor" fill={filled ? 'currentColor' : 'none'} />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function PlayPauseIcon({ playing, size = 20, reduce }: { playing: boolean, size?: number, reduce: boolean | null }) {
  return <IconSwap id={playing ? 'pause' : 'play'} icon={playing ? PauseIcon : PlayIcon} size={size} filled reduce={reduce} />
}

function FullscreenIcon({ active, reduce }: { active: boolean, reduce: boolean | null }) {
  return <IconSwap id={active ? 'exit' : 'enter'} icon={active ? MinimizeScreenIcon : FullScreenIcon} strokeWidth={2.3} reduce={reduce} />
}

function VolumeIcon({ level, reduce }: { level: number, reduce: boolean | null }) {
  const id   = level === 0 ? 'mute' : level < 0.5 ? 'low' : 'high'
  const icon = level === 0 ? VolumeMute02Icon : level < 0.5 ? VolumeLowIcon : VolumeHighIcon
  return <IconSwap id={id} icon={icon} strokeWidth={2.3} reduce={reduce} />
}

function VolLine({ value, onChange, onDragChange }: {
  value: number
  onChange: (v: number) => void
  onDragChange?: (dragging: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const setDrag = (v: boolean) => {
    drag.current = v
    onDragChange?.(v)
  }
  const setFromX = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r || r.width <= 0) return
    onChange(Math.min(1, Math.max(0, (clientX - r.left) / r.width)))
  }
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="flex h-9 w-[4.5rem] cursor-pointer touch-none items-center px-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      onPointerDown={e => {
        setDrag(true)
        e.currentTarget.setPointerCapture?.(e.pointerId)
        setFromX(e.clientX)
      }}
      onPointerMove={e => { if (drag.current) setFromX(e.clientX) }}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      onKeyDown={e => {
        const step = 0.1
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(1, value + step)) }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(0, value - step)) }
        else if (e.key === 'Home') { e.preventDefault(); onChange(0) }
        else if (e.key === 'End') { e.preventDefault(); onChange(1) }
      }}
    >
      <div className="relative h-[2px] w-full rounded-full bg-white/30">
        <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${value * 100}%` }} />
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
          style={{ left: `${value * 100}%` }}
        />
      </div>
    </div>
  )
}

export interface VideoPlayerProps {
  src?       : string
  poster?    : string
  autoPlay?  : boolean
  loop?      : boolean
  /** Corner radius (squircle-smoothed). Default 18. */
  radius?    : number
  /** Edge-sampled ambilight behind the player. Default true. */
  ambient?   : boolean
  /**
   * Frame aspect ratio. CSS form (`16/9`) or colon form (`16:9`).
   * Default `16/9`. Any valid CSS ratio works for custom frames.
   */
  aspectRatio? : string
  className? : string
}

function toCssAspect(ratio: string) {
  const v = ratio.trim().replace(':', '/')
  return v || '16/9'
}

export function VideoPlayer({
  src, poster, autoPlay = false, loop = false,
  radius = 32, ambient = true, aspectRatio = '16/9',
  className,
}: VideoPlayerProps) {
  const videoRef      = useRef<HTMLVideoElement>(null)
  const glowRef       = useRef<HTMLCanvasElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const hideTimer     = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const seekingRef    = useRef(false)
  const resumeAfterSeek = useRef(false)
  const skipOverlayClick = useRef(false)

  const reduce = useReducedMotion()

  const [playing,     setPlaying]     = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [volume,      setVolume]      = useState(1)
  const [muted,       setMuted]       = useState(false)
  const [buffered,    setBuffered]    = useState(0)
  const [fullscreen,  setFullscreen]  = useState(false)
  const [showCtrl,    setShowCtrl]    = useState(true)
  const [seeking,     setSeeking]     = useState(false)
  const [hoverSeek,   setHoverSeek]   = useState<number | null>(null)
  const [volHover,    setVolHover]    = useState(false)
  const [volDragging, setVolDragging] = useState(false)
  const [ctrlFocused, setCtrlFocused] = useState(false)
  const showVol = volHover || volDragging

  const revealControls = useCallback(() => {
    setShowCtrl(true)
    clearTimeout(hideTimer.current)
    if (playing && !seeking && !ctrlFocused) {
      hideTimer.current = setTimeout(() => setShowCtrl(false), 2500)
    }
  }, [playing, seeking, ctrlFocused])

  useEffect(() => revealControls(), [playing, seeking, ctrlFocused, revealControls])

  useEffect(() => {
    const onFSChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  // `onLoadedMetadata` fires once, and a cached source can load before this
  // effect attaches, leaving duration stuck at 0. Seed it directly whenever the
  // browser already has metadata.
  useEffect(() => {
    const v = videoRef.current
    if (v && v.readyState >= 1 && isFinite(v.duration)) setDuration(v.duration)
  }, [src])

  // Ambilight: a small copy of the current frame, scaled up and blurred behind
  // the player. The blur alone turns the rectangle into a halo.
  useEffect(() => {
    if (!ambient || !src) return
    const video = videoRef.current
    const canvas = glowRef.current
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const W = 80
    const H = 45
    canvas.width = W
    canvas.height = H

    let raf = 0
    let vfc = 0
    let alive = true

    const paint = () => {
      if (!alive || video.readyState < 2) return
      try { ctx.drawImage(video, 0, 0, W, H) } catch { /* tainted - skip */ }
    }

    const loop = () => {
      paint()
      if (!alive || video.paused) return
      if (typeof video.requestVideoFrameCallback === 'function') {
        vfc = video.requestVideoFrameCallback(loop)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }

    const onPlay = () => loop()
    const onStop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      if (vfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(vfc)
      vfc = 0
      paint()
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onStop)
    video.addEventListener('seeked', paint)
    video.addEventListener('loadeddata', paint)
    paint()
    if (!video.paused) loop()

    return () => {
      alive = false
      onStop()
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onStop)
      video.removeEventListener('seeked', paint)
      video.removeEventListener('loadeddata', paint)
    }
  }, [ambient, src])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    // Read the element, not React state: seeking can fire a spurious pause
    // event that desyncs `playing` from the real paused flag.
    if (!v.paused) { v.pause(); return }
    // play() rejects if the source cannot be decoded, so swallow it rather than
    // throwing an unhandled rejection on a bad src.
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }

  const toggleMute = () => {
    const v = videoRef.current!
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFS = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const seekToClientX = (clientX: number, rect: DOMRect) => {
    const v = videoRef.current
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setHoverSeek(pct)
    if (!v || !duration) return
    v.currentTime = pct * duration
    setCurrentTime(pct * duration)
  }

  const endSeek = () => {
    setSeeking(false)
    const v = videoRef.current
    const shouldResume = resumeAfterSeek.current
    resumeAfterSeek.current = false
    const done = () => {
      requestAnimationFrame(() => { seekingRef.current = false })
    }
    if (v && shouldResume) {
      const p = v.play()
      if (p && typeof p.then === 'function') p.then(done, done)
      else done()
    } else {
      done()
    }
  }

  // Pointer capture keeps the scrub tracking the cursor once it leaves the thin
  // track, the same way Slider handles its thumb. preventDefault stops the
  // following click from reaching the play overlay and pausing the video.
  const onSeekPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // preventDefault also suppresses the browser's click-to-focus, so focus has
    // to be set manually or the slider stays keyboard-inert after a mouse scrub.
    e.currentTarget.focus()
    skipOverlayClick.current = true
    const v = videoRef.current
    resumeAfterSeek.current = !!v && !v.paused
    seekingRef.current = true
    setSeeking(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    seekToClientX(e.clientX, e.currentTarget.getBoundingClientRect())
  }
  const onSeekPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverSeek(pct)
    if (seekingRef.current) seekToClientX(e.clientX, rect)
  }
  const onSeekPointerUp = () => endSeek()

  const applyVol = (pct: number) => {
    const v = videoRef.current!
    v.volume = pct
    v.muted = pct === 0
    setVolume(pct)
    setMuted(pct === 0)
  }

  const progress = duration ? currentTime / duration : 0
  const volLevel  = muted ? 0 : volume
  const tipPct = seeking ? progress : (hoverSeek ?? progress)
  const showTip = (seeking || hoverSeek !== null) && duration > 0

  return (
    <div
      ref={containerRef}
      className={cn('group relative select-none', className)}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && !seeking && setShowCtrl(false)}
      style={{ cursor: showCtrl ? 'auto' : 'none' }}
    >
      <div
        className="relative isolate w-full overflow-visible"
        style={{
          aspectRatio: toCssAspect(aspectRatio),
          transition: reduce ? undefined : 'aspect-ratio 480ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
      {ambient && src && (
        <canvas
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-[32px] opacity-40 dark:opacity-30"
          style={{
            width: '105%',
            height: '105%',
            filter: 'blur(16px) saturate(1.3) brightness(1.08)',
          }}
        />
      )}

      {/* Player - squircle-clipped. Own inset box so the frame always fills
          the aspect-ratio wrapper even when SmoothCorners sizes to the video. */}
      <div className="absolute inset-0 z-[1] [&>div]:h-full [&>div]:w-full">
      <SmoothCorners corners={{ radius, smoothing: 0.6 }} className="block h-full w-full overflow-hidden bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="auto"
        loop={loop}
        playsInline
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => { if (!seekingRef.current) setPlaying(false) }}
        onTimeUpdate={() => {
          const v = videoRef.current!
          setCurrentTime(v.currentTime)
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
        }}
        onLoadedMetadata={() => {
          setDuration(videoRef.current!.duration)
          if (autoPlay) { const p = videoRef.current!.play(); if (p?.catch) p.catch(() => {}) }
        }}
      />

      {/* Click-to-play overlay */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (skipOverlayClick.current) {
            skipOverlayClick.current = false
            return
          }
          togglePlay()
        }}
      />

      {/* No src placeholder */}
      {!src && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" className="h-14 w-14 opacity-40">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor" stroke="none" />
          </svg>
          <p className="text-[13px] font-medium">No video source</p>
        </div>
      )}

      {/* Center play button - frosted, appears while paused. initial={false}
          keeps it from popping in on first mount when the player starts
          paused - the pop is reserved for actual play↔pause transitions. */}
      <AnimatePresence initial={false}>
        {src && !playing && (
          <motion.button
            onClick={togglePlay}
            aria-label="Play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={reduce ? { duration: 0.1 } : { type: 'spring', duration: 0.35, bounce: 0.25 }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span
              className="flex h-[66px] w-[66px] items-center justify-center rounded-full text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/25 transition-transform active:scale-[0.96]"
              style={{ background: 'rgba(18,18,20,0.32)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            >
              {/* HugeIcons' PlayIcon path is already balanced inside its own
                  24×24 box (roughly x:5→18.9, y:4.6→19.4 - centroid ~12,12),
                  so it sits centered here with no manual nudge. */}
              <HugeiconsIcon icon={PlayIcon} size={26} strokeWidth={1.8} color="currentColor" fill="currentColor" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Controls - fade in with a light bottom veil, no frosted tray */}
      <AnimatePresence>
        {showCtrl && src && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-x-0 bottom-0 z-20 px-4 pb-3.5 pt-14"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.1) 48%, transparent 100%)',
            }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onFocus={() => setCtrlFocused(true)}
            onBlur={() => setCtrlFocused(false)}
          >
            {/* Progress bar */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={currentTime}
              aria-valuetext={`${fmt(currentTime)} of ${fmt(duration)}`}
              className="group/seek relative mb-1.5 flex h-7 w-full cursor-pointer touch-none items-end px-0.5 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              onPointerDown={onSeekPointerDown}
              onPointerMove={onSeekPointerMove}
              onPointerUp={onSeekPointerUp}
              onPointerCancel={onSeekPointerUp}
              onPointerLeave={() => { if (!seeking) setHoverSeek(null) }}
              onKeyDown={e => {
                const v = videoRef.current
                if (!v || !duration) return
                const step = e.shiftKey ? 10 : 5
                if (e.key === 'ArrowRight') { e.preventDefault(); v.currentTime = Math.min(duration, v.currentTime + step); setCurrentTime(v.currentTime) }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); v.currentTime = Math.max(0, v.currentTime - step); setCurrentTime(v.currentTime) }
                else if (e.key === 'Home') { e.preventDefault(); v.currentTime = 0; setCurrentTime(0) }
                else if (e.key === 'End') { e.preventDefault(); v.currentTime = duration; setCurrentTime(duration) }
              }}
            >
              {showTip && (
                <div
                  className="pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white shadow-sm"
                  // Clamped inside the track's edges so the centred tooltip never
                  // pokes past the frame at the very start or end.
                  style={{ left: `clamp(22px, ${tipPct * 100}%, calc(100% - 22px))` }}
                >
                  {fmt(tipPct * duration)}
                </div>
              )}
              <div className={cn('relative w-full rounded-full bg-white/25 transition-[height] duration-150 group-hover/seek:h-[5px]', seeking ? 'h-[5px]' : 'h-[3px]')}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.45)]" style={{ width: `${progress * 100}%` }} />
                <div
                  className={cn('absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow transition-opacity group-hover/seek:opacity-100', seeking ? 'opacity-100' : 'opacity-0')}
                  style={{ left: `calc(${progress * 100}% - 6px)` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white transition-[background-color,transform] duration-150 hover:bg-white/15 active:scale-[0.96]"
              >
                <PlayPauseIcon playing={playing} reduce={reduce} />
              </button>

              <div
                className="flex items-center"
                onPointerEnter={() => setVolHover(true)}
                onPointerLeave={() => setVolHover(false)}
                onFocus={() => setVolHover(true)}
                onBlur={() => setVolHover(false)}
              >
                <button
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white/85 transition-[background-color,color,transform] duration-150 hover:bg-white/15 hover:text-white active:scale-[0.96]"
                >
                  <VolumeIcon level={volLevel} reduce={reduce} />
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-columns,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    showVol
                      ? 'grid-cols-[1fr] opacity-100'
                      : 'pointer-events-none grid-cols-[0fr] overflow-hidden opacity-0',
                  )}
                >
                  <div className="min-w-0">
                    <VolLine value={volLevel} onChange={applyVol} onDragChange={setVolDragging} />
                  </div>
                </div>
              </div>

              <div className="flex-1" />
              <button
                onClick={toggleFS}
                aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white/85 transition-[background-color,color,transform] duration-150 hover:bg-white/15 hover:text-white active:scale-[0.96]"
              >
                <FullscreenIcon active={fullscreen} reduce={reduce} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </SmoothCorners>
      </div>
      </div>
    </div>
  )
}
