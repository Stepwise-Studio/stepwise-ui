'use client'

import {
  GrainGradient,
  GodRays,
  MeshGradient,
  StaticRadialGradient,
  Waves,
} from '@paper-design/shaders-react'
import { ShaderBackdrop, useShaderSpeed } from './veil-shell'

const fill = { width: '100%', height: '100%' } as const

export function HeroDrift() {
  const speed = useShaderSpeed(0.12)
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <GrainGradient
        colors={['#f0ebe0', '#d4a574', '#c4783a', '#8b5a2b']}
        colorBack="#f5f0e8"
        shape="wave"
        intensity={0.35}
        noise={0.4}
        softness={0.7}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroHaze() {
  const speed = useShaderSpeed(0.18)
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <MeshGradient
        colors={['#f0f4ff', '#93c5fd', '#6366f1', '#c4b5fd']}
        distortion={0.75}
        swirl={0.45}
        speed={speed}
        grainOverlay={0.06}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroBloom() {
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <StaticRadialGradient
        colors={['#fcd34d', '#f59e0b', '#fef3c7', '#fffbeb']}
        colorBack="#fffbeb"
        offsetY={-0.4}
        radius={0.7}
        falloff={0.35}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroTide() {
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <Waves
        colorFront="#94a3b8"
        colorBack="#e2e8f0"
        scale={1.2}
        frequency={0.25}
        amplitude={0.45}
        spacing={1.2}
        proportion={0.5}
        softness={0.4}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroMist() {
  const speed = useShaderSpeed(0.15)
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <GodRays
        colorBack="#f8f6f1"
        colorBloom="#fbbf24"
        colors={['#fbbf2488', '#f59e0baa', '#ffffff55']}
        density={0.4}
        intensity={0.65}
        bloom={0.35}
        spotty={0.2}
        offsetY={-0.5}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroHazeDark() {
  const speed = useShaderSpeed(0.2)
  return (
    <ShaderBackdrop fade="bottom" tone="dark">
      <MeshGradient
        colors={['#09090b', '#312e81', '#7c3aed', '#22d3ee']}
        distortion={0.85}
        swirl={0.5}
        speed={speed}
        grainOverlay={0.08}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function HeroFilm() {
  const speed = useShaderSpeed(0.1)
  return (
    <ShaderBackdrop fade="bottom" tone="light">
      <GrainGradient
        colors={['#e8e4dc', '#a8a29e', '#78716c', '#d6d3d1']}
        colorBack="#f5f5f4"
        shape="corners"
        intensity={0.28}
        noise={0.7}
        softness={0.8}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}
