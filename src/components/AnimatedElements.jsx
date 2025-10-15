import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

/**
 * AnimatedLine - Animated line that draws itself
 */
export function AnimatedLine({ 
  start = [-3, 0, 0], 
  end = [3, 0, 0], 
  color = "#ff0040",
  duration = 1,
  delay = 0,
  width = 2
}) {
  const lineRef = useRef()
  const [progress, setProgress] = React.useState(0)
  
  useEffect(() => {
    const tl = gsap.timeline({ delay })
    tl.to({ val: 0 }, {
      val: 1,
      duration,
      ease: "power2.inOut",
      onUpdate: function() {
        setProgress(this.targets()[0].val)
      }
    })
  }, [duration, delay])
  
  const geometry = React.useMemo(() => {
    const points = []
    const currentEnd = [
      start[0] + (end[0] - start[0]) * progress,
      start[1] + (end[1] - start[1]) * progress,
      start[2] + (end[2] - start[2]) * progress
    ]
    points.push(new THREE.Vector3(...start))
    points.push(new THREE.Vector3(...currentEnd))
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [start, end, progress])
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={width} />
    </line>
  )
}

/**
 * AnimatedBox - Box that scales/rotates in
 */
export function AnimatedBox({ 
  position = [0, 0, 0], 
  size = [1, 1, 1], 
  color = "#ffffff",
  animation = 'scale', // 'scale', 'rotate', 'bounce'
  duration = 0.8,
  delay = 0
}) {
  const meshRef = useRef()
  
  useEffect(() => {
    if (meshRef.current) {
      switch (animation) {
        case 'scale':
          gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 })
          gsap.to(meshRef.current.scale, {
            x: 1, y: 1, z: 1,
            duration,
            delay,
            ease: "back.out(1.7)"
          })
          break
        case 'rotate':
          gsap.set(meshRef.current.rotation, { x: Math.PI, y: Math.PI })
          gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 })
          gsap.to(meshRef.current.rotation, {
            x: 0, y: 0,
            duration,
            delay,
            ease: "power2.inOut"
          })
          gsap.to(meshRef.current.scale, {
            x: 1, y: 1, z: 1,
            duration: duration * 0.8,
            delay,
            ease: "power2.out"
          })
          break
        case 'bounce':
          gsap.set(meshRef.current.position, { 
            y: position[1] + 3 
          })
          gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 })
          gsap.to(meshRef.current.position, {
            y: position[1],
            duration,
            delay,
            ease: "bounce.out"
          })
          gsap.to(meshRef.current.scale, {
            x: 1, y: 1, z: 1,
            duration: duration * 0.5,
            delay,
            ease: "power2.out"
          })
          break
      }
    }
  }, [animation, position, duration, delay])
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

/**
 * FloatingParticles - Floating particles background
 */
export function FloatingParticles({ 
  count = 50, 
  spread = 20,
  color = "#ffffff",
  size = 0.05,
  speed = 0.5
}) {
  const particlesRef = useRef([])
  
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ],
      velocity: [
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed
      ]
    }))
  }, [count, spread, speed])
  
  useFrame(() => {
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        const data = particles[i]
        particle.position.x += data.velocity[0] * 0.01
        particle.position.y += data.velocity[1] * 0.01
        particle.position.z += data.velocity[2] * 0.01
        
        // Wrap around
        if (Math.abs(particle.position.x) > spread/2) {
          particle.position.x *= -1
        }
        if (Math.abs(particle.position.y) > spread/2) {
          particle.position.y *= -1
        }
        if (Math.abs(particle.position.z) > spread/2) {
          particle.position.z *= -1
        }
      }
    })
  })
  
  return (
    <group>
      {particles.map((particle, i) => (
        <mesh
          key={particle.id}
          ref={el => particlesRef.current[i] = el}
          position={particle.position}
        >
          <sphereGeometry args={[size, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * AnimatedGrid - Animated grid of elements
 */
export function AnimatedGrid({ 
  rows = 5, 
  cols = 5, 
  spacing = 1,
  position = [0, 0, 0],
  elementSize = 0.3,
  color = "#ff0040",
  animation = 'wave', // 'wave', 'random', 'spiral'
  duration = 2
}) {
  const gridRef = useRef()
  const elementsRef = useRef([])
  
  useEffect(() => {
    elementsRef.current.forEach((element, index) => {
      if (element) {
        const row = Math.floor(index / cols)
        const col = index % cols
        
        gsap.set(element.scale, { x: 0, y: 0, z: 0 })
        
        let delay = 0
        switch (animation) {
          case 'wave':
            delay = (row + col) * 0.05
            break
          case 'random':
            delay = Math.random() * duration
            break
          case 'spiral':
            const centerRow = rows / 2
            const centerCol = cols / 2
            const distance = Math.sqrt(
              Math.pow(row - centerRow, 2) + 
              Math.pow(col - centerCol, 2)
            )
            delay = distance * 0.1
            break
        }
        
        gsap.to(element.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.5,
          delay,
          ease: "back.out(1.7)"
        })
      }
    })
  }, [rows, cols, animation, duration])
  
  const elements = React.useMemo(() => {
    const items = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2) * spacing
        const y = (row - rows / 2) * spacing
        items.push({ x, y, index: row * cols + col })
      }
    }
    return items
  }, [rows, cols, spacing])
  
  return (
    <group ref={gridRef} position={position}>
      {elements.map(({ x, y, index }) => (
        <mesh
          key={index}
          ref={el => elementsRef.current[index] = el}
          position={[x, y, 0]}
        >
          <boxGeometry args={[elementSize, elementSize, elementSize]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}
