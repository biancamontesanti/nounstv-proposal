import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ScrollPresentation from './components/ScrollPresentation'
import { SelectiveBloom } from './components/SelectiveBloom'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [canvasError, setCanvasError] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setViewport({ width, height })
      
      // Production-ready mobile detection
      const isMobileDevice = width <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
      
      
      setIsMobile(isMobileDevice)
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate responsive camera settings
  const getCameraSettings = () => {
    const aspect = viewport.width / viewport.height
    const fov = isMobile ? 85 : 75 // Wider FOV for mobile
    const position = isMobile ? [0, 0, 6] : [0, 0, 8] // Closer for mobile
    
    return {
      position,
      fov,
      aspect
    }
  }

  const cameraSettings = getCameraSettings()

  return (
    <div style={{ 
      width: '100vw', 
      height: isMobile ? '100dvh' : '100vh',
      background: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={cameraSettings}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: isMobile ? "low-power" : "high-performance"
        }}
        dpr={isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          // Canvas created successfully
        }}
        onError={(error) => {
          console.error('Canvas error:', error)
          setCanvasError(true)
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Clean scroll presentation with selective bloom */}
        <SelectiveBloom 
          bloomConfig={{
            intensity: isMobile ? 0.8 : 1, // Reduce bloom intensity on mobile
            kernelSize: isMobile ? 1 : 2,
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0.5,
            mipmapBlur: !isMobile // Disable mipmap blur on mobile for performance
          }}
        >
          <ScrollPresentation isMobile={isMobile} viewport={viewport} />
        </SelectiveBloom>
        
        {/* Controls disabled for scroll presentation */}
        {/* <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
        /> */}
      </Canvas>
      
      {/* Fallback content if Canvas fails */}
      {canvasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div>
            <h1 style={{ color: '#ff0040', marginBottom: '20px' }}>Nouns TV</h1>
            <p>Loading presentation...</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
              If this persists, please refresh the page.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
