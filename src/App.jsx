import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import ScrollPresentation from './components/ScrollPresentation'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Clean scroll presentation */}
        <ScrollPresentation />
        
        {/* Controls disabled for scroll presentation */}
        {/* <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
        /> */}
        
        {/* Post-processing effects with enhanced bloom for titles */}
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            intensity={4}
            kernelSize={2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.5}
            mipmapBlur={true}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default App
