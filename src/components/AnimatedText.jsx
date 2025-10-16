import React, { useRef, useEffect, useState } from 'react'
import { Text, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { BloomLayer } from './SelectiveBloom'

// Font URLs for Londrina Solid weights
const FONT_URLS = {
  100: '/fonts/londrina-solid-latin-100-normal.woff',
  300: '/fonts/londrina-solid-latin-300-normal.woff',
  400: '/fonts/londrina-solid-latin-400-normal.woff',
  900: '/fonts/londrina-solid-latin-900-normal.woff'
}

/**
 * FadeInText - Text that fades in when triggered
 */
export function FadeInText({ 
  children, 
  position = [0, 0, 0], 
  fontSize = 0.5, 
  color = "#ffffff",
  delay = 0,
  duration = 0.8,
  anchorX = "center",
  anchorY = "middle",
  maxWidth = 20,
  fontWeight = 400,
  bloom = false, // New prop to control bloom
  isMobile = false, // Mobile optimization
  ...props 
}) {
  const textRef = useRef()
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    if (textRef.current) {
      gsap.set(textRef.current.material, { opacity: 0 })
      setIsReady(true)
    }
  }, [])
  
  useEffect(() => {
    if (isReady && textRef.current) {
      gsap.to(textRef.current.material, {
        opacity: 1,
        duration: isMobile ? duration * 0.7 : duration, // Faster animations on mobile
        delay: isMobile ? delay * 0.5 : delay, // Shorter delays on mobile
        ease: isMobile ? "power1.out" : "power2.out" // Simpler easing on mobile
      })
    }
  }, [isReady, delay, duration, isMobile])
  
  const textElement = (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      font={FONT_URLS[fontWeight] || FONT_URLS[400]}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )

  return bloom ? (
    <BloomLayer enabled={bloom}>
      {textElement}
    </BloomLayer>
  ) : textElement
}

/**
 * SlideInText - Text that slides in from a direction
 */
export function SlideInText({ 
  children, 
  position = [0, 0, 0], 
  fontSize = 0.5, 
  color = "#ffffff",
  delay = 0,
  duration = 0.8,
  from = 'left', // 'left', 'right', 'top', 'bottom'
  distance = 3,
  anchorX = "center",
  anchorY = "middle",
  maxWidth = 20,
  fontWeight = 400,
  bloom = false, // New prop to control bloom
  ...props 
}) {
  const textRef = useRef()
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    if (textRef.current) {
      gsap.set(textRef.current.material, { opacity: 0 })
      
      // Set initial position based on direction
      const initialPos = { ...position }
      switch (from) {
        case 'left':
          gsap.set(textRef.current.position, { x: position[0] - distance })
          break
        case 'right':
          gsap.set(textRef.current.position, { x: position[0] + distance })
          break
        case 'top':
          gsap.set(textRef.current.position, { y: position[1] + distance })
          break
        case 'bottom':
          gsap.set(textRef.current.position, { y: position[1] - distance })
          break
      }
      setIsReady(true)
    }
  }, [position, from, distance])
  
  useEffect(() => {
    if (isReady && textRef.current) {
      gsap.to(textRef.current.material, {
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "power2.out"
      })
      gsap.to(textRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: duration,
        delay: delay,
        ease: "power2.out"
      })
    }
  }, [isReady, position, delay, duration])
  
  const textElement = (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      font={FONT_URLS[fontWeight] || FONT_URLS[400]}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )

  return bloom ? (
    <BloomLayer enabled={bloom}>
      {textElement}
    </BloomLayer>
  ) : textElement
}

/**
 * TypewriterText - Text that appears letter by letter with optional blinking cursor
 */
export function TypewriterText({ 
  children, 
  position = [0, 0, 0], 
  fontSize = 0.5, 
  color = "#ffffff",
  delay = 0,
  speed = 50, // ms per character
  anchorX = "center",
  anchorY = "middle",
  maxWidth = 20,
  fontWeight = 400,
  showCursor = true, // New prop to show/hide blinking cursor
  cursorColor = "#ff0040", // Color for the cursor
  scrollStart = 0, // Scroll position to start animation
  scrollEnd = 1, // Scroll position to end animation
  ...props 
}) {
  const textRef = useRef()
  const cursorRef = useRef()
  const scroll = useScroll()
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [showCursorBlink, setShowCursorBlink] = useState(true)
  const [isTyping, setIsTyping] = useState(false) // Start as false until scroll triggers
  const [hasStarted, setHasStarted] = useState(false)
  const fullText = children?.toString() || ''
  
  // Scroll detection
  useFrame(() => {
    if (scroll && !hasStarted) {
      const scrollOffset = scroll.offset
      
      // Check if we're in the scroll range
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        setHasStarted(true)
        setIsTyping(true)
      }
    }
  })
  
  useEffect(() => {
    // Reset state when fullText changes
    setDisplayText('')
    setIndex(0)
    setIsTyping(false)
    setHasStarted(false)
  }, [fullText])
  
  useEffect(() => {
    if (isTyping && index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index])
        setIndex((prev) => prev + 1)
      }, index === 0 ? delay * 1000 : speed)
      
      return () => clearTimeout(timeout)
    } else if (index >= fullText.length) {
      setIsTyping(false)
    }
  }, [index, fullText, speed, delay, isTyping])
  
  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor || isTyping) return
    
    const interval = setInterval(() => {
      setShowCursorBlink((prev) => !prev)
    }, 530) // Standard cursor blink speed
    
    return () => clearInterval(interval)
  }, [showCursor, isTyping])
  
  return (
    <group>
      <Text
        ref={textRef}
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        font={FONT_URLS[fontWeight] || FONT_URLS[400]}
        material-transparent
        material-toneMapped={false}
        {...props}
      >
        {displayText}
      </Text>
      {showCursor && (
        <Text
          ref={cursorRef}
          position={[
            position[0] + (displayText.length * fontSize * 0.3), // Approximate cursor position
            position[1], 
            position[2]
          ]}
          fontSize={fontSize}
          color={cursorColor}
          anchorX={anchorX}
          anchorY={anchorY}
          font={FONT_URLS[fontWeight] || FONT_URLS[400]}
          material-transparent
          material-toneMapped={false}
          material-opacity={showCursorBlink || isTyping ? 1 : 0}
        >
          |
        </Text>
      )}
    </group>
  )
}

/**
 * GlitchText - Text with glitch effect
 */
export function GlitchText({ 
  children, 
  position = [0, 0, 0], 
  fontSize = 0.5, 
  color = "#ffffff",
  glitchColor = "#ff0040",
  intensity = 0.5,
  anchorX = "center",
  anchorY = "middle",
  maxWidth = 20,
  fontWeight = 400,
  ...props 
}) {
  const textRef = useRef()
  const glitchRef1 = useRef()
  const glitchRef2 = useRef()
  
  useFrame(({ clock }) => {
    if (Math.random() > 0.95) {
      if (glitchRef1.current) {
        const offset = (Math.random() - 0.5) * intensity * 0.2
        glitchRef1.current.position.x = position[0] + offset
        glitchRef1.current.material.opacity = Math.random() * 0.5
      }
      if (glitchRef2.current) {
        const offset = (Math.random() - 0.5) * intensity * 0.2
        glitchRef2.current.position.x = position[0] - offset
        glitchRef2.current.material.opacity = Math.random() * 0.5
      }
    } else {
      if (glitchRef1.current) glitchRef1.current.material.opacity = 0
      if (glitchRef2.current) glitchRef2.current.material.opacity = 0
    }
  })
  
  const fontUrl = FONT_URLS[fontWeight] || FONT_URLS[400]
  
  return (
    <group>
      <Text
        ref={textRef}
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        font={fontUrl}
        material-transparent
        material-toneMapped={false}
        {...props}
      >
        {children}
      </Text>
      <Text
        ref={glitchRef1}
        position={[position[0], position[1], position[2] - 0.01]}
        fontSize={fontSize}
        color={glitchColor}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        font={fontUrl}
        material-transparent
        material-toneMapped={false}
        material-opacity={0}
        {...props}
      >
        {children}
      </Text>
      <Text
        ref={glitchRef2}
        position={[position[0], position[1], position[2] - 0.02]}
        fontSize={fontSize}
        color="#00ffff"
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        font={fontUrl}
        material-transparent
        material-toneMapped={false}
        material-opacity={0}
        {...props}
      >
        {children}
      </Text>
    </group>
  )
}

/**
 * PulseText - Text that pulses in size
 */
export function PulseText({ 
  children, 
  position = [0, 0, 0], 
  fontSize = 0.5, 
  color = "#ffffff",
  pulseSpeed = 2,
  pulseAmount = 0.1,
  anchorX = "center",
  anchorY = "middle",
  maxWidth = 20,
  fontWeight = 400,
  ...props 
}) {
  const textRef = useRef()
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      const pulse = Math.sin(clock.elapsedTime * pulseSpeed) * pulseAmount + 1
      textRef.current.scale.set(pulse, pulse, 1)
    }
  })
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      font={FONT_URLS[fontWeight] || FONT_URLS[400]}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )
}
