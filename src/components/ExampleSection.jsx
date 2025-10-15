import React from 'react'
import SmoothScrollPresentation from './SmoothScrollPresentation'
import Section from './Section'
import ScrambleTitle from './ScrambleTitle'
import { 
  FadeInText, 
  SlideInText, 
  TypewriterText, 
  GlitchText,
  PulseText 
} from './AnimatedText'
import { 
  AnimatedLine, 
  AnimatedBox, 
  FloatingParticles,
  AnimatedGrid 
} from './AnimatedElements'

/**
 * Example: How to create custom sections with the new modular system
 * 
 * This example demonstrates how easy it is to:
 * 1. Create sections with different animations
 * 2. Combine multiple animation components
 * 3. Control timing and transitions
 * 4. Add interactive elements
 */

function ExampleSection() {
  return (
    <SmoothScrollPresentation
      pages={5}
      damping={0.1}  // Smooth scrolling damping
      eps={0.001}     // Precision
      scrollIndicator={true}
    >
      {/* Section 1: Hero with ScrambleTitle */}
      <Section
        scrollStart={0}
        scrollEnd={0.2}
        position={[0, 0, 0]}
        animation="fade"
        animationConfig={{ duration: 1 }}
      >
        <ScrambleTitle
          position={[0, 2, 0]}
          scrollStart={0}
          scrollEnd={0.2}
          delay={0.5}
        >
          Your Amazing Title
        </ScrambleTitle>
        <AnimatedLine
          start={[-3, 0, 0]}
          end={[3, 0, 0]}
          color="#ff0040"
          delay={1}
        />
        <FadeInText
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#cccccc"
          delay={1.5}
        >
          Subtitle with fade in animation
        </FadeInText>
      </Section>

      {/* Section 2: Sliding content from different directions */}
      <Section
        scrollStart={0.2}
        scrollEnd={0.4}
        position={[0, -10, 0]}
        animation="slide"
        animationConfig={{ slideFrom: -5, duration: 0.8 }}
      >
        <SlideInText
          position={[0, 2, 0]}
          fontSize={1}
          color="#ff0040"
          from="left"
        >
          Slide from Left
        </SlideInText>
        <SlideInText
          position={[0, 0, 0]}
          fontSize={0.8}
          color="#ffffff"
          from="right"
          delay={0.3}
        >
          Slide from Right
        </SlideInText>
        <SlideInText
          position={[0, -2, 0]}
          fontSize={0.6}
          color="#cccccc"
          from="bottom"
          delay={0.6}
        >
          Slide from Bottom
        </SlideInText>
      </Section>

      {/* Section 3: Typewriter and Glitch effects */}
      <Section
        scrollStart={0.4}
        scrollEnd={0.6}
        position={[0, -20, 0]}
        animation="scale"
        animationConfig={{ duration: 0.6, ease: "back.out(1.7)" }}
      >
        <TypewriterText
          position={[0, 2, 0]}
          fontSize={0.8}
          color="#ffffff"
          speed={50}
        >
          This text types itself out...
        </TypewriterText>
        <GlitchText
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#ff0040"
          glitchColor="#00ffff"
          intensity={0.5}
        >
          Glitch Effect Text
        </GlitchText>
        <PulseText
          position={[0, -2, 0]}
          fontSize={0.5}
          color="#ffffff"
          pulseSpeed={2}
          pulseAmount={0.1}
        >
          Pulsing Text
        </PulseText>
      </Section>

      {/* Section 4: Grid animations and particles */}
      <Section
        scrollStart={0.6}
        scrollEnd={0.8}
        position={[0, -30, 0]}
        animation="rotate"
        animationConfig={{ rotateFrom: Math.PI / 6, duration: 1 }}
      >
        <FadeInText
          position={[0, 3, 0]}
          fontSize={1}
          color="#ff0040"
        >
          Interactive Elements
        </FadeInText>
        <AnimatedGrid
          rows={3}
          cols={3}
          spacing={1.5}
          position={[0, 0, 0]}
          elementSize={0.3}
          color="#ff0040"
          animation="spiral"  // Try 'wave', 'random', or 'spiral'
          duration={2}
        />
        <FloatingParticles
          count={30}
          spread={10}
          color="#ff004040"
          size={0.03}
          speed={0.5}
        />
      </Section>

      {/* Section 5: Custom animations with callbacks */}
      <Section
        scrollStart={0.8}
        scrollEnd={1.0}
        position={[0, -40, 0]}
        animation="fade"
        onEnter={(ref) => console.log('Section entered!', ref)}
        onExit={(ref) => console.log('Section exited!', ref)}
        onProgress={(progress) => console.log('Progress:', progress)}
      >
        <PulseText
          position={[0, 0, 0]}
          fontSize={1}
          color="#ff0040"
        >
          The End
        </PulseText>
        <TypewriterText
          position={[0, -2, 0]}
          fontSize={0.4}
          color="#cccccc"
          delay={0.5}
          speed={30}
        >
          Create amazing scroll presentations with ease!
        </TypewriterText>
        <AnimatedBox
          position={[0, -4, 0]}
          size={[0.5, 0.5, 0.5]}
          color="#ff0040"
          animation="bounce"
          delay={1}
        />
      </Section>
    </SmoothScrollPresentation>
  )
}

export default ExampleSection
