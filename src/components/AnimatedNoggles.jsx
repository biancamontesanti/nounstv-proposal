import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Html } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

/**
 * AnimatedNoggles - Displays Nouns noggles that cover the screen
 * White parts are transparent, allowing you to see through
 */
function AnimatedNoggles({ 
  scrollStart = 0, 
  scrollEnd = 0.1,
  position = [0, 0, 0]
}) {
  const groupRef = useRef()
  const scroll = useScroll()
  const [opacity, setOpacity] = useState(0)
  const hasEntered = useRef(false)
  
  useFrame(() => {
    if (scroll && groupRef.current) {
      const scrollOffset = scroll.offset
      
      // Calculate opacity based on scroll position
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        // Fade in at the start, fade out at the end
        const sectionProgress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        let newOpacity
        if (sectionProgress < 0.3) {
          // Fade in during first 30%
          newOpacity = sectionProgress / 0.3
        } else if (sectionProgress > 0.7) {
          // Fade out during last 30%
          newOpacity = (1 - sectionProgress) / 0.3
        } else {
          // Full opacity in the middle
          newOpacity = 1
        }
        
        setOpacity(newOpacity)
        
        if (!hasEntered.current) {
          hasEntered.current = true
        }
      } else {
        setOpacity(0)
        if (scrollOffset > scrollEnd) {
          hasEntered.current = false
        }
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        transform
        occlude={false}
        zIndexRange={[100, 0]}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: opacity,
          transition: 'opacity 0.1s ease-out'
        }}
      >
        <svg
          width="800"
          height="300"
          viewBox="0 0 800 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(243, 50, 44, 0.5))',
            maxWidth: '80vw',
            height: 'auto'
          }}
        >
          {/* White parts removed/made transparent */}
          <path d="M300 49.9999H400V250H300V49.9999Z" fill="black"/>
          <path d="M650 49.9999H750V250H650V49.9999Z" fill="black"/>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M800 300H500V150H450V300H150V150H50V250H0V100H150V0H450V100H500V0H800V300ZM750 250V50H550V250H750ZM200 250H400V50H200V250Z" 
            fill="#F3322C"
          />
        </svg>
      </Html>
    </group>
  )
}

/**
 * NogglesCoverScreen - Full screen noggles overlay
 * Uses HTML overlay for better SVG rendering
 */
export function NogglesCoverScreen({ scrollStart = 0, scrollEnd = 0.1 }) {
  const scroll = useScroll()
  const [opacity, setOpacity] = useState(0)
  const [scale, setScale] = useState(0.8)
  
  useFrame(() => {
    if (scroll) {
      const scrollOffset = scroll.offset
      
      console.log('Scroll offset:', scrollOffset, 'Range:', scrollStart, '-', scrollEnd)
      
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        const sectionProgress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        let newOpacity, newScale
        if (sectionProgress < 0.3) {
          // Fade in and scale up during first 30%
          newOpacity = sectionProgress / 0.3
          newScale = 0.8 + (0.2 * (sectionProgress / 0.3))
        } else if (sectionProgress > 0.7) {
          // Fade out and scale up during last 30%
          const fadeProgress = (sectionProgress - 0.7) / 0.3
          newOpacity = 1 - fadeProgress
          newScale = 1 + (fadeProgress * 0.3)
        } else {
          // Full opacity in the middle
          newOpacity = 1
          newScale = 1
        }
        
        console.log('Setting opacity:', newOpacity, 'scale:', newScale)
        setOpacity(newOpacity)
        setScale(newScale)
      } else {
        if (opacity !== 0) {
          setOpacity(0)
        }
      }
    }
  })
  
  if (opacity === 0) return null
  
  return (
    <Html
      center
      position={[0, 0, 5]}
      style={{
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      transform
      zIndexRange={[100, 0]}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.05s ease-out, transform 0.05s ease-out',
        }}
      >
        <svg
          width="800"
          height="300"
          viewBox="0 0 800 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(243, 50, 44, 0.6))',
            width: '80vw',
            height: 'auto'
          }}
        >
          {/* Only black and red parts - white is transparent */}
          <path d="M300 49.9999H400V250H300V49.9999Z" fill="black"/>
          <path d="M650 49.9999H750V250H650V49.9999Z" fill="black"/>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M800 300H500V150H450V300H150V150H50V250H0V100H150V0H450V100H500V0H800V300ZM750 250V50H550V250H750ZM200 250H400V50H200V250Z" 
            fill="#F3322C"
          />
        </svg>
      </div>
    </Html>
  )
}

export default AnimatedNoggles

