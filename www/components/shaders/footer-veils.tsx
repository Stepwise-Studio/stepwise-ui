'use client'

import {
  Dithering,
  DotGrid,
  GrainGradient,
  StaticRadialGradient,
  Waves,
} from '@paper-design/shaders-react'
import { ShaderBackdrop, useShaderSpeed } from './veil-shell'

const fill = { width: '100%', height: '100%' } as const

export function FooterFade() {
  return (
    <ShaderBackdrop fade="top" tone="light">
      <div style={{ width: '100%', height: '100%', transform: 'scaleY(-1)' }}>
        <StaticRadialGradient
          colors={['#c4b5fd', '#a78bfa', '#ede9fe', '#faf5ff']}
          colorBack="#faf5ff"
          radius={0.85}
          falloff={0.4}
          style={fill}
        />
      </div>
    </ShaderBackdrop>
  )
}

export function FooterRipple() {
  const speed = useShaderSpeed(0.08)
  return (
    <ShaderBackdrop fade="top" tone="light">
      <GrainGradient
        colors={['#e7e5e4', '#a8a29e', '#57534e', '#d6d3d1']}
        colorBack="#f5f5f4"
        shape="ripple"
        intensity={0.25}
        noise={0.5}
        softness={0.85}
        scale={0.55}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function FooterLattice() {
  return (
    <ShaderBackdrop fade="top" tone="light">
      <DotGrid
        colorBack="#f4f4f5"
        colorFill="#a1a1aa"
        colorStroke="#a1a1aa"
        size={2}
        gapX={24}
        gapY={24}
        strokeWidth={0}
        shape="circle"
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function FooterTide() {
  return (
    <ShaderBackdrop fade="top" tone="light">
      <Waves
        colorFront="#64748b"
        colorBack="#cbd5e1"
        scale={1.3}
        frequency={0.2}
        amplitude={0.35}
        spacing={1.3}
        proportion={0.45}
        softness={0.5}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function FooterDither() {
  const speed = useShaderSpeed(0.1)
  return (
    <ShaderBackdrop fade="top" tone="dark">
      <Dithering
        colorBack="#09090b"
        colorFront="#22d3ee"
        shape="dots"
        type="4x4"
        size={2.5}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}

export function FooterFadeDark() {
  return (
    <ShaderBackdrop fade="top" tone="dark">
      <div style={{ width: '100%', height: '100%', transform: 'scaleY(-1)' }}>
        <StaticRadialGradient
          colors={['#4c1d95', '#7c3aed', '#1e1b4b', '#09090b']}
          colorBack="#09090b"
          radius={0.8}
          falloff={0.45}
          style={fill}
        />
      </div>
    </ShaderBackdrop>
  )
}

export function FooterGrain() {
  const speed = useShaderSpeed(0.06)
  return (
    <ShaderBackdrop fade="top" tone="light">
      <GrainGradient
        colors={['#d4d4d8', '#a1a1aa', '#71717a', '#e4e4e7']}
        colorBack="#f4f4f5"
        shape="dots"
        intensity={0.2}
        noise={0.75}
        softness={0.9}
        scale={0.7}
        speed={speed}
        style={fill}
      />
    </ShaderBackdrop>
  )
}
