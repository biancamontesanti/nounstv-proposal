import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Import all SVG assets
import headAbstract from '../assets/medias/head-abstract.svg'
import headCherry from '../assets/medias/head-cherry.svg'
import headChipboard from '../assets/medias/head-chipboard.svg'
import headClover from '../assets/medias/head-clover.svg'
import headCrown from '../assets/medias/head-crown.svg'
import headCrtBsod from '../assets/medias/head-crt-bsod.svg'
import headDucky from '../assets/medias/head-ducky.svg'
import headEarth from '../assets/medias/head-earth.svg'
import headFloppyDisk from '../assets/medias/head-floppy-disk.svg'
import headPiggybank from '../assets/medias/head-piggybank.svg'
import headSkateboard from '../assets/medias/head-skateboard.svg'
import headVendingMachine from '../assets/medias/head-vending-machine.svg'

// Grid Item Component with hover effects
function GridItem({ svgPath, position, index }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { pointer } = useThree()
  
  // Track mouse velocity for inertia effect
  const mouseVelocity = useRef({ x: 0, y: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })
  
  // Load SVG as texture
  const texture = useLoader(THREE.TextureLoader, svgPath)
  
  // Create geometry for the SVG display
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(2, 2)
  }, [])
  
  useFrame(() => {
    // Calculate mouse velocity
    mouseVelocity.current.x = pointer.x - lastMousePos.current.x
    mouseVelocity.current.y = pointer.y - lastMousePos.current.y
    lastMousePos.current.x = pointer.x
    lastMousePos.current.y = pointer.y
    
    // Hover effects with inertia
    if (hovered && meshRef.current) {
      // Apply inertia-based movement
      meshRef.current.position.x += mouseVelocity.current.x * 2
      meshRef.current.position.y -= mouseVelocity.current.y * 2
      
      // Smooth return to original position
      meshRef.current.position.x *= 0.92
      meshRef.current.position.y *= 0.92
      meshRef.current.position.z *= 0.92
    } else if (meshRef.current) {
      // Return to original position when not hovered
      meshRef.current.position.x *= 0.9
      meshRef.current.position.y *= 0.9
      meshRef.current.position.z *= 0.9
      meshRef.current.rotation.z *= 0.9
    }
  })
  
  // Handle hover
  const handlePointerEnter = () => {
    setHovered(true)
    if (meshRef.current) {
      // Random rotation on hover
      gsap.to(meshRef.current.rotation, {
        z: (Math.random() - 0.5) * 0.5,
        duration: 0.4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      })
      
      // Slight scale up
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }
  
  const handlePointerLeave = () => {
    setHovered(false)
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }
  
  // Initial setup - show immediately
  React.useEffect(() => {
    if (groupRef.current) {
      gsap.set(groupRef.current.scale, { x: 1, y: 1, z: 1 })
    }
  }, [])
  
  return (
    <group ref={groupRef} position={position}>
      {/* SVG as texture on mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0, 0, 0.5]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <meshBasicMaterial 
          map={texture} 
          transparent 
          alphaTest={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// Main Grid Animation Component
function GridAnimation({ scrollStart = 0.15, scrollEnd = 0.35, yPosition = -20 }) {
  // SVG assets array
  const svgAssets = [
    headAbstract,
    headCherry,
    headChipboard,
    headClover,
    headCrown,
    headCrtBsod,
    headDucky,
    headEarth,
    headFloppyDisk,
    headPiggybank,
    headSkateboard,
    headVendingMachine
  ]
  
  // Create grid positions (4x3 grid)
  const gridPositions = useMemo(() => {
    const positions = []
    const gridWidth = 4
    const gridHeight = 3
    const spacing = 2.5
    
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const x = (col - gridWidth / 2 + 0.5) * spacing
        const y = (row - gridHeight / 2 + 0.5) * spacing
        positions.push([x, y, 0])
      }
    }
    
    return positions
  }, [])
  
  return (
    <group position={[0, yPosition, 0]}>
      {/* Grid items */}
      {gridPositions.map((pos, index) => (
        <GridItem
          key={index}
          svgPath={svgAssets[index % svgAssets.length]}
          position={pos}
          index={index}
        />
      ))}
    </group>
  )
}

export default GridAnimation
