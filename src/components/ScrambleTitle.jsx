import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, useScroll } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { BloomLayer } from './SelectiveBloom'

// Font URLs for Londrina Solid weights
const FONT_URLS = {
  100: '/fonts/londrina-solid-latin-100-normal.woff',
  300: '/fonts/londrina-solid-latin-300-normal.woff',
  400: '/fonts/londrina-solid-latin-400-normal.woff',
  900: '/fonts/londrina-solid-latin-900-normal.woff'
}

// Scramble Title Component with delayed entrance and mouse interaction
function ScrambleTitle({ 
  children, 
  position, 
  scrollStart, 
  scrollEnd, 
  delay = 2,
  fontWeight = 900,
  bloom = true // Enable bloom by default for titles
}) {
  const groupRef = useRef()
  const [chars, setChars] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const scroll = useScroll()
  const { mouse, viewport } = useThree()
  
  const scrambleChars = ".:|*#@"
  
  // Split text into characters
  useEffect(() => {
    if (children) {
      const text = children.toString()
      const charArray = text.split('').map((char, index) => ({
        original: char,
        current: char,
        index,
        isScrambling: false
      }))
      setChars(charArray)
    }
  }, [children])
  
  // Handle scroll visibility with delay
  useFrame(() => {
    if (scroll && groupRef.current) {
      const scrollOffset = scroll.offset
      
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        if (!isVisible) {
          // Delayed entrance animation
          setTimeout(() => {
            setIsVisible(true)
            // Animate each character in with stagger
            chars.forEach((_, index) => {
              if (groupRef.current && groupRef.current.children[index]) {
                gsap.fromTo(groupRef.current.children[index], 
                  { 
                    scale: 0,
                    opacity: 0,
                    rotation: Math.random() * Math.PI 
                  },
                  {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: "back.out(2)"
                  }
                )
              }
            })
          }, delay * 1000)
        }
        
        // Mouse interaction for scramble effect
        if (isVisible && groupRef.current) {
          const mouseX = (mouse.x * viewport.width) / 2
          const mouseY = (mouse.y * viewport.height) / 2
          
          groupRef.current.children.forEach((charMesh, index) => {
            if (charMesh && charMesh.position) {
              const charWorldPos = new THREE.Vector3()
              charMesh.getWorldPosition(charWorldPos)
              
              const distance = Math.sqrt(
                Math.pow(mouseX - charWorldPos.x, 2) + 
                Math.pow(mouseY - charWorldPos.y, 2)
              )
              
              if (distance < 3 && !chars[index]?.isScrambling) {
                scrambleChar(index, distance)
              }
            }
          })
        }
      } else if (scrollOffset < scrollStart - 0.02) {
        setIsVisible(false)
        if (groupRef.current) {
          groupRef.current.children.forEach(child => {
            if (child) {
              gsap.set(child, { opacity: 0, scale: 0 })
            }
          })
        }
      }
    }
  })
  
  const scrambleChar = (index, distance) => {
    const char = chars[index]
    if (!char) return
    
    const newChars = [...chars]
    newChars[index].isScrambling = true
    setChars(newChars)
    
    const scrambleDuration = 1.2 - Math.min(distance / 3, 1)
    const scrambleSteps = Math.floor(scrambleDuration * 10)
    
    let step = 0
    const scrambleInterval = setInterval(() => {
      if (step < scrambleSteps) {
        const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        const updatedChars = [...chars]
        updatedChars[index].current = randomChar
        setChars(updatedChars)
        step++
      } else {
        const finalChars = [...chars]
        finalChars[index].current = finalChars[index].original
        finalChars[index].isScrambling = false
        setChars(finalChars)
        clearInterval(scrambleInterval)
      }
    }, 100)
  }
  
  const titleGroup = (
    <group ref={groupRef} position={position}>
      {chars.map((char, index) => (
        <Text
          key={index}
          position={[index * 0.7 - (chars.length * 0.35), 0, 0]}
          fontSize={1.2}
          color="#ff0040"
          anchorX="center"
          anchorY="middle"
          font={FONT_URLS[fontWeight] || FONT_URLS[900]}
          material-transparent
          material-toneMapped={false}
        >
          {char.current === ' ' ? '\u00A0' : char.current}
        </Text>
      ))}
    </group>
  )

  return bloom ? (
    <BloomLayer enabled={bloom}>
      {titleGroup}
    </BloomLayer>
  ) : titleGroup
}

export default ScrambleTitle
