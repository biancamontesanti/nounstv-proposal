import React, { useRef, useEffect, useState } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

/**
 * SimpleText - Ultra-simple text with basic fade animation
 */
export function SimpleText({
  children,
  position = [0, 0, 0],
  fontSize = 0.5,
  color = "#ffffff",
  fontWeight = 400,
  maxWidth = 20,
  textAlign = "center",
  scrollStart = 0,
  scrollEnd = 1,
  delay = 0,
  isMobile = false
}) {
  const scroll = useScroll()
  const textRef = useRef()

  useFrame(() => {
    if (scroll && textRef.current) {
      const scrollOffset = scroll.offset
      
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        const sectionProgress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        // Simple fade in/out
        let opacity = 0
        if (sectionProgress < 0.3) {
          opacity = sectionProgress / 0.3
        } else if (sectionProgress > 0.7) {
          opacity = (1 - sectionProgress) / 0.3
        } else {
          opacity = 1
        }
        
        if (textRef.current.material) {
          textRef.current.material.opacity = Math.max(0, Math.min(1, opacity))
        }
      } else {
        if (textRef.current.material) {
          textRef.current.material.opacity = 0
        }
      }
    }
  })

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      fontWeight={fontWeight}
      maxWidth={maxWidth}
      textAlign={textAlign}
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={0}
    >
      {children}
    </Text>
  )
}

/**
 * SimpleList - Basic list with simple animations
 */
export function SimpleList({ 
  items, 
  position, 
  scrollStart = 0, 
  scrollEnd = 1, 
  isMobile = false 
}) {
  return (
    <group position={position}>
      {items.map((item, index) => (
        <SimpleText
          key={index}
          position={[isMobile ? -7 : 0, -index * (isMobile ? 1.0 : 0.7), 0]}
          fontSize={isMobile ? 0.35 : 0.4}
          color="#ffffff"
          fontWeight={300}
          scrollStart={scrollStart}
          scrollEnd={scrollEnd}
          textAlign={isMobile ? "left" : "center"}
          maxWidth={isMobile ? 14 : 20}
          delay={index * 0.1}
        >
          {item}
        </SimpleText>
      ))}
    </group>
  )
}