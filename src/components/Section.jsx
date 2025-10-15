import React, { useRef, useEffect } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

/**
 * Modular Section Component
 * A reusable container for scroll-triggered content sections
 */
function Section({ 
  children, 
  scrollStart, 
  scrollEnd, 
  position = [0, 0, 0],
  onEnter,
  onExit,
  onProgress,
  animation = 'fade',
  animationConfig = {}
}) {
  const groupRef = useRef()
  const scroll = useScroll()
  const hasEntered = useRef(false)
  const isActive = useRef(false)
  
  // Initialize section
  useEffect(() => {
    if (groupRef.current) {
      // Set initial state based on animation type
      switch (animation) {
        case 'fade':
          gsap.set(groupRef.current, { opacity: 0 })
          break
        case 'slide':
          gsap.set(groupRef.current.position, { 
            x: position[0] + (animationConfig.slideFrom || -5) 
          })
          gsap.set(groupRef.current, { opacity: 0 })
          break
        case 'scale':
          gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 })
          break
        case 'rotate':
          gsap.set(groupRef.current.rotation, { 
            z: animationConfig.rotateFrom || Math.PI / 4 
          })
          gsap.set(groupRef.current, { opacity: 0 })
          break
        default:
          break
      }
    }
  }, [animation, position, animationConfig])
  
  useFrame(() => {
    if (scroll && groupRef.current) {
      const scrollOffset = scroll.offset
      
      // Check if section is in view
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        const progress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        // Trigger enter animation
        if (!hasEntered.current) {
          hasEntered.current = true
          isActive.current = true
          
          // Execute enter callback
          if (onEnter) onEnter(groupRef.current)
          
          // Perform enter animation
          switch (animation) {
            case 'fade':
              gsap.to(groupRef.current, {
                opacity: 1,
                duration: animationConfig.duration || 0.8,
                ease: animationConfig.ease || "power2.out"
              })
              break
            case 'slide':
              gsap.to(groupRef.current, {
                opacity: 1,
                duration: animationConfig.duration || 0.8,
                ease: animationConfig.ease || "power2.out"
              })
              gsap.to(groupRef.current.position, {
                x: position[0],
                duration: animationConfig.duration || 0.8,
                ease: animationConfig.ease || "power2.out"
              })
              break
            case 'scale':
              gsap.to(groupRef.current.scale, {
                x: 1, y: 1, z: 1,
                duration: animationConfig.duration || 0.6,
                ease: animationConfig.ease || "back.out(1.7)"
              })
              break
            case 'rotate':
              gsap.to(groupRef.current.rotation, {
                z: 0,
                duration: animationConfig.duration || 1,
                ease: animationConfig.ease || "power2.inOut"
              })
              gsap.to(groupRef.current, {
                opacity: 1,
                duration: animationConfig.duration || 0.8,
                ease: animationConfig.ease || "power2.out"
              })
              break
            default:
              break
          }
        }
        
        // Execute progress callback
        if (onProgress) onProgress(progress, groupRef.current)
        
      } else if (scrollOffset < scrollStart - 0.02) {
        // Reset when scrolling back up
        if (isActive.current) {
          isActive.current = false
          hasEntered.current = false
          
          // Execute exit callback
          if (onExit) onExit(groupRef.current)
          
          // Quick reset
          switch (animation) {
            case 'fade':
            case 'slide':
            case 'rotate':
              gsap.to(groupRef.current, {
                opacity: 0,
                duration: 0.3
              })
              break
            case 'scale':
              gsap.to(groupRef.current.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.3
              })
              break
            default:
              break
          }
        }
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  )
}

export default Section
