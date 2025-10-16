import React, { useMemo } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Text } from '@react-three/drei'

/**
 * SelectiveBloom System
 * 
 * This system allows you to control which elements receive bloom effects.
 * 
 * Usage:
 * 1. Wrap your scene with <SelectiveBloom> in App.jsx
 * 2. Use bloom={true} prop on text components that should have bloom
 * 3. Use bloom={false} prop on text components that should NOT have bloom
 * 4. Or manually wrap elements with <BloomLayer enabled={true/false}>
 * 
 * Examples:
 * - <FadeInText bloom={true}>This text will have bloom</FadeInText>
 * - <FadeInText bloom={false}>This text will NOT have bloom</FadeInText>
 * - <BloomLayer enabled={true}><YourElement /></BloomLayer>
 */
export function SelectiveBloom({ children, bloomConfig = {} }) {
  const defaultBloomConfig = {
    blendFunction: BlendFunction.ADD,
    intensity: 1,
    kernelSize: 2,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.5,
    mipmapBlur: true,
    ...bloomConfig
  }

  return (
    <>
      {children}
      <EffectComposer>
        <Bloom 
          {...defaultBloomConfig}
          // Only apply bloom to layer 1 (elements wrapped in BloomLayer)
          layers={[1]}
        />
      </EffectComposer>
    </>
  )
}

/**
 * BloomLayer - A component that applies bloom to specific elements
 * Wrap elements that should have bloom with this component
 */
export function BloomLayer({ children, enabled = true }) {
  return (
    <group layers={enabled ? [1] : [0]}>
      {children}
    </group>
  )
}

/**
 * NoBloomLayer - A component that explicitly excludes elements from bloom
 * Use this to ensure certain elements never get bloom effects
 */
export function NoBloomLayer({ children }) {
  return (
    <group layers={[0]}>
      {children}
    </group>
  )
}

/**
 * BloomText - A text component with built-in bloom control
 * This extends the regular Text component with bloom layer support
 */
export function BloomText({ 
  bloom = true, 
  children, 
  ...textProps 
}) {
  return (
    <BloomLayer enabled={bloom}>
      <Text {...textProps}>
        {children}
      </Text>
    </BloomLayer>
  )
}
