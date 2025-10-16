import React, { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

/**
 * MobileText - Ultra-simple text for mobile
 */
export function MobileText({
  children,
  position = [0, 0, 0],
  fontSize = 0.4,
  color = "#ffffff",
  fontWeight = 400,
  maxWidth = 16,
  textAlign = "left",
  scrollStart = 0,
  scrollEnd = 1
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
        if (sectionProgress < 0.2) {
          opacity = sectionProgress / 0.2
        } else if (sectionProgress > 0.8) {
          opacity = (1 - sectionProgress) / 0.2
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
      anchorX={textAlign === "left" ? "left" : "center"}
      anchorY="middle"
      material-transparent
      material-opacity={0}
    >
      {children}
    </Text>
  )
}

/**
 * MobileList - Simple list for mobile
 */
export function MobileList({ 
  items, 
  position, 
  scrollStart = 0, 
  scrollEnd = 1
}) {
  return (
    <group position={position}>
      {items.map((item, index) => (
        <MobileText
          key={index}
          position={[-7, -index * 1.0, 0]}
          fontSize={0.35}
          color="#ffffff"
          fontWeight={300}
          scrollStart={scrollStart}
          scrollEnd={scrollEnd}
          textAlign="left"
          maxWidth={14}
        >
          {item}
        </MobileText>
      ))}
    </group>
  )
}
