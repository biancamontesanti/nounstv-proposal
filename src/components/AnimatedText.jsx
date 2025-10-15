import React, { useRef, useEffect, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

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
        duration: duration,
        delay: delay,
        ease: "power2.out"
      })
    }
  }, [isReady, delay, duration])
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )
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
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )
}

/**
 * TypewriterText - Text that appears letter by letter
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
  ...props 
}) {
  const textRef = useRef()
  const [displayText, setDisplayText] = useState('')
  const fullText = children?.toString() || ''
  
  useEffect(() => {
    let currentIndex = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.substring(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, speed)
      
      return () => clearInterval(interval)
    }, delay * 1000)
    
    return () => clearTimeout(timer)
  }, [fullText, delay, speed])
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {displayText}
    </Text>
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
      material-transparent
      material-toneMapped={false}
      {...props}
    >
      {children}
    </Text>
  )
}
