import React, { useMemo, useEffect, useState } from 'react'
import SmoothScrollPresentation from './SmoothScrollPresentation'
import Section from './Section'
import ScrambleTitle from './ScrambleTitle'
import GridAnimation from './GridAnimation'
import ScramblingWords from './ScramblingWords'
import { NogglesCoverScreen } from './AnimatedNoggles'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
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
 * BulletList - Modular bullet point list component
 */
function BulletList({ items, position, delay = 0 }) {
  return (
    <group position={position}>
      {items.map((item, index) => (
        <group key={index} position={[0, -index * 0.7, 0]}>
          <AnimatedBox
            position={[-6, 0, 0]}
            size={[0.12, 0.12, 0.12]}
          color="#ff0040"
            animation="scale"
            delay={delay + index * 0.1}
          />
          <SlideInText
            position={[-5.5, 0, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="left"
            delay={delay + index * 0.1 + 0.05}
            from="left"
            distance={1.5}
          >
            {item.replace(/\*\*/g, '')}
          </SlideInText>
        </group>
      ))}
    </group>
  )
}

/**
 * SimpleNoggleOverlay - Simpler version using React Portal
 */
function SimpleNoggleOverlay({ scrollStart, scrollEnd }) {
  const scroll = useScroll()
  const [opacity, setOpacity] = useState(0)
  const [scale, setScale] = useState(0.8)
  const [mousePosition, setMousePosition] = useState({ x: 0, isHovered: false })
  
  useFrame(() => {
    if (scroll) {
      const scrollOffset = scroll.offset
      
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        const sectionProgress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        let newOpacity, newScale
        if (sectionProgress < 0.3) {
          newOpacity = sectionProgress / 0.3
          newScale = 0.8 + (0.2 * (sectionProgress / 0.3))
        } else if (sectionProgress > 0.7) {
          const fadeProgress = (sectionProgress - 0.7) / 0.3
          newOpacity = 1 - fadeProgress
          newScale = 1 + (fadeProgress * 0.3)
        } else {
          newOpacity = 1
          newScale = 1
        }
        
        setOpacity(newOpacity)
        setScale(newScale)
      } else {
        setOpacity(0)
      }
    }
  })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const overlayDiv = document.getElementById('noggles-overlay')
      if (overlayDiv && opacity > 0) {
        const rect = overlayDiv.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Check if mouse is inside the overlay area
        const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
        
        if (isInside) {
          // Calculate relative position (0 = left edge, 1 = right edge)
          const relativeX = x / rect.width
          setMousePosition({ x: relativeX, isHovered: true })
        } else {
          setMousePosition({ x: 0.5, isHovered: false })
        }
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [opacity])
  
  useEffect(() => {
    // Create overlay div if it doesn't exist
    let overlayDiv = document.getElementById('noggles-overlay')
    if (!overlayDiv) {
      overlayDiv = document.createElement('div')
      overlayDiv.id = 'noggles-overlay'
      overlayDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 9999;
      `
      document.body.appendChild(overlayDiv)
    }
    
    return () => {
      const div = document.getElementById('noggles-overlay')
      if (div) {
        document.body.removeChild(div)
      }
    }
  }, [])
  
  useEffect(() => {
    const overlayDiv = document.getElementById('noggles-overlay')
    if (overlayDiv) {
      overlayDiv.style.opacity = opacity
      overlayDiv.style.transform = `scale(${scale})`
      overlayDiv.style.transition = 'opacity 0.1s ease-out, transform 0.1s ease-out'
      
      if (opacity > 0 && !overlayDiv.querySelector('svg')) {
        overlayDiv.innerHTML = `
          <div id="noggles-container" style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          ">
            <!-- Background text that shows through the noggles -->
   
            
            <!-- Noggles SVG -->
            <svg
              id="noggles-svg"
              width="320"
              height="320"
              viewBox="0 0 320 320"
              xmlns="http://www.w3.org/2000/svg"
              shape-rendering="crispEdges"
              style="
                filter: drop-shadow(0 0 30px rgba(86, 72, 237, 0.6));
                width: 60vw;
                height: auto;
                position: relative;
                z-index: 1;
                cursor: pointer;
                transition: transform 0.3s ease-out;
              "
            >
              <rect width="100%" height="100%" fill="none" />
              <rect width="60" height="10" x="100" y="110" fill="#5648ed" />
              <rect width="60" height="10" x="170" y="110" fill="#5648ed" />
              <rect width="10" height="10" x="100" y="120" fill="#5648ed" />
              <rect width="20" height="10" x="110" y="120" fill="#ffffff" />
              <rect width="20" height="10" x="130" y="120" fill="#000000" />
              <rect width="10" height="10" x="150" y="120" fill="#5648ed" />
              <rect width="10" height="10" x="170" y="120" fill="#5648ed" />
              <rect width="20" height="10" x="180" y="120" fill="#ffffff" />
              <rect width="20" height="10" x="200" y="120" fill="#000000" />
              <rect width="10" height="10" x="220" y="120" fill="#5648ed" />
              <rect width="40" height="10" x="70" y="130" fill="#5648ed" />
              <rect width="20" height="10" x="110" y="130" fill="#ffffff" />
              <rect width="20" height="10" x="130" y="130" fill="#000000" />
              <rect width="30" height="10" x="150" y="130" fill="#5648ed" />
              <rect width="20" height="10" x="180" y="130" fill="#ffffff" />
              <rect width="20" height="10" x="200" y="130" fill="#000000" />
              <rect width="10" height="10" x="220" y="130" fill="#5648ed" />
              <rect width="10" height="10" x="70" y="140" fill="#5648ed" />
              <rect width="10" height="10" x="100" y="140" fill="#5648ed" />
              <rect width="20" height="10" x="110" y="140" fill="#ffffff" />
              <rect width="20" height="10" x="130" y="140" fill="#000000" />
              <rect width="10" height="10" x="150" y="140" fill="#5648ed" />
              <rect width="10" height="10" x="170" y="140" fill="#5648ed" />
              <rect width="20" height="10" x="180" y="140" fill="#ffffff" />
              <rect width="20" height="10" x="200" y="140" fill="#000000" />
              <rect width="10" height="10" x="220" y="140" fill="#5648ed" />
              <rect width="10" height="10" x="70" y="150" fill="#5648ed" />
              <rect width="10" height="10" x="100" y="150" fill="#5648ed" />
              <rect width="20" height="10" x="110" y="150" fill="#ffffff" />
              <rect width="20" height="10" x="130" y="150" fill="#000000" />
              <rect width="10" height="10" x="150" y="150" fill="#5648ed" />
              <rect width="10" height="10" x="170" y="150" fill="#5648ed" />
              <rect width="20" height="10" x="180" y="150" fill="#ffffff" />
              <rect width="20" height="10" x="200" y="150" fill="#000000" />
              <rect width="10" height="10" x="220" y="150" fill="#5648ed" />
              <rect width="60" height="10" x="100" y="160" fill="#5648ed" />
              <rect width="60" height="10" x="170" y="160" fill="#5648ed" />
            </svg>
          </div>
        `
      }
    }
  }, [opacity, scale])
  
  useEffect(() => {
    const svgElement = document.getElementById('noggles-svg')
    if (svgElement) {
      if (mousePosition.isHovered) {
        // Map mouse position (0-1) to movement (-30% to +30%)
        // 0 = left side = move left (-30%)
        // 0.5 = center = no movement (0%)
        // 1 = right side = move right (+30%)
        const movement = (mousePosition.x - 0.5) * 60 // Range: -30 to +30
        svgElement.style.transform = `translateX(${movement}%)`
      } else {
        svgElement.style.transform = 'translateX(0)'
      }
    }
  }, [mousePosition])
  
  return null
}

/**
 * ScrollPresentation - Main presentation component using modular architecture
 */
function ScrollPresentation() {
  // Define sections with their configurations
  const sections = useMemo(() => [
    {
      id: 'intro',
      scrollStart: 0,
      scrollEnd: 0.05,
      position: [0, 0, 0],
      animation: 'fade',
      content: (
        <group>
          <ScrambleTitle
            position={[0, 1.9, 0]}
            scrollStart={0}
            scrollEnd={0.05}
            delay={1.5}
          >
            The future belongs to creators
          </ScrambleTitle>
  :
        </group>
      )
    },
    {
      id: 'noggles',
      scrollStart: 0.03,
      scrollEnd: 0.09,
      position: [0, -7, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={1.2}
          color="#ff0040"
          delay={0.2}
        >
          Put your noggles on
        </FadeInText>
      )
    },
    {
      id: 'welcome',
      scrollStart: 0.10,
      scrollEnd: 0.15,
      position: [0, -18, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.8}
          color="#ffffff"
          delay={0.2}
        >
          Welcome to Nouns TV
        </FadeInText>
      )
    },
    {
      id: 'platform',
      scrollStart: 0.11,
      scrollEnd: 0.16,
      position: [0, -21, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#cccccc"
          delay={0.2}
        >
          A complete OTT platform.
        </FadeInText>
      )
    },
    {
      id: 'description',
      scrollStart: 0.13,
      scrollEnd: 0.18,
      position: [0, -29, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Where artists, filmmakers, and creators{'\n'}can stream and protect their content — all in one place.
        </FadeInText>
      )
    },
    {
      id: 'marketplace',
      scrollStart: 0.17,
      scrollEnd: 0.23,
      position: [0, -40, 0],
      animation: 'fade',
      content: (
        <group>
          <FadeInText
            position={[0, 2, 0]}
            fontSize={1}
            color="#ff0040"
            delay={0.1}
          >
            Integrated marketplace
          </FadeInText>
          <BulletList
            items={[
        "sell and rent for recorded content",
        "tickets for live events",
        "subscriptions for followers",
        "donations for free content"
            ]}
            position={[0, 0, 0]}
            delay={0.3}
          />
        </group>
      )
    },
    {
      id: 'grid-animation',
      scrollStart: 0.18,
      scrollEnd: 0.4,
      position: [0, -25, 0],
      animation: 'none',
      content: (
        <GridAnimation 
          scrollStart={0.18}
          scrollEnd={0.4}
          yPosition={0}
        />
      )
    },
    {
      id: 'features',
      scrollStart: 0.24,
      scrollEnd: 0.28,
      position: [0, -55, 0],
      animation: 'fade',
      content: (
        <group>
          <BulletList
            items={[
        "4K content",
        "artificial intelligence for subtitles",
        "channel dashboard",
        "and more"
            ]}
            position={[0, 0, 0]}
            delay={0.2}
          />
        </group>
      )
    },
    {
      id: 'ecosystem',
      scrollStart: 0.26,
      scrollEnd: 0.32,
      position: [0, -65, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Our ecosystem is powered by Privy, offering a smooth and secure wallet experience for creators and audiences alike — bridging access, content, and ownership.
        </FadeInText>
      )
    },
    {
      id: 'screens',
      scrollStart: 0.30,
      scrollEnd: 0.36,
      position: [0, -75, 0],
      animation: 'fade',
      content: (
        <group>
          <FadeInText
            position={[0, 2, 0]}
            fontSize={1}
            color="#ff0040"
            delay={0.1}
          >
            Optimized for every screen
          </FadeInText>
          <FadeInText
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#ffffff"
            delay={0.3}
            maxWidth={20}
            textAlign="center"
          >
            Web, Smart TVs, Apple TV,{'\n'}iOS, and Android.
          </FadeInText>
        </group>
      )
    },
    {
      id: 'art-statement',
      scrollStart: 0.38,
      scrollEnd: 0.42,
      position: [0, -84, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#cccccc"
          delay={0.2}
        >
          We understand that digital content is a work of art.
        </FadeInText>
      )
    },
    {
      id: 'protection',
      scrollStart: 0.44,
      scrollEnd: 0.48,
      position: [0, -96, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#ff0040"
          delay={0.2}
        >
          And we do everything to protect it.
        </FadeInText>
      )
    },
    {
      id: 'security',
      scrollStart: 0.42,
      scrollEnd: 0.48,
      position: [0, -105, 0],
      animation: 'fade',
      content: (
        <group>
          <BulletList
            items={[
              "Anti-piracy protection",
              "End-to-end encryption",
              "DRM certification"
            ]}
            position={[0, 0, 0]}
            delay={0.2}
          />
        </group>
      )
    },
    {
      id: 'worldwide',
      scrollStart: 0.46,
      scrollEnd: 0.52,
      position: [0, -118, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          delay={0.2}
        >
          Everything creators need to share their content safely — worldwide.
        </FadeInText>
      )
    },
    {
      id: 'connect',
      scrollStart: 0.50,
      scrollEnd: 0.56,
      position: [0, -128, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.7}
          color="#ffffff"
          delay={0.2}
        >
          Watch. Support. Connect. Anywhere.
        </FadeInText>
      )
    },
    {
      id: 'history',
      scrollStart: 0.54,
      scrollEnd: 0.60,
      position: [0, -140, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={1}
          color="#ff0040"
          delay={0.2}
        >
          Our history
        </FadeInText>
      )
    },
    {
      id: 'pandemic',
      scrollStart: 0.58,
      scrollEnd: 0.64,
      position: [0, -148, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          During the pandemic,{'\n'}artists lost their stages.
        </FadeInText>
      )
    },
    {
      id: 'soundclub',
      scrollStart: 0.62,
      scrollEnd: 0.68,
      position: [0, -158, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          SoundClub was our answer —{'\n'}a live streaming tool with{'\n'}built-in payments{'\n'}that kept music alive when the{'\n'}world stopped.
        </FadeInText>
      )
    },
    {
      id: 'stats',
      scrollStart: 0.66,
      scrollEnd: 0.72,
      position: [0, -168, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Thousands of live shows.{'\n'}Hundreds of creators.{'\n'}Millions of memories — all online.
        </FadeInText>
      )
    },
    {
      id: 'origin',
      scrollStart: 0.70,
      scrollEnd: 0.76,
      position: [0, -178, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Born in Rio de Janeiro,{'\n'}built for the world.
        </FadeInText>
      )
    },
    {
      id: 'innovation',
      scrollStart: 0.74,
      scrollEnd: 0.80,
      position: [0, -188, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          What began as survival{'\n'}became innovation.{'\n\n'}A secure, scalable platform for creators worldwide.
        </FadeInText>
      )
    },
    {
      id: 'nouns-culture',
      scrollStart: 0.78,
      scrollEnd: 0.84,
      position: [0, -198, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Nouns culture mirrors ours —{'\n'}helping creators expand their art.
        </FadeInText>
      )
    },
    {
      id: 'together',
      scrollStart: 0.82,
      scrollEnd: 0.88,
      position: [0, -208, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Together,{'\n'}we can bring secure streaming{'\n'}and on-demand experiences{'\n'}to every creator.
        </FadeInText>
      )
    },
    {
      id: 'gratitude',
      scrollStart: 0.86,
      scrollEnd: 0.92,
      position: [0, -218, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          delay={0.2}
        >
          Our team is grateful for your support.
        </FadeInText>
      )
    },
    {
      id: 'vote',
      scrollStart: 0.90,
      scrollEnd: 0.96,
      position: [0, -230, 0],
      animation: 'fade',
      content: (
        <group>
          <FadeInText
            position={[0, 2, 0]}
            fontSize={1.2}
            color="#ff0040"
            delay={0.2}
          >
            Vote for Nouns TV
          </FadeInText>
          <AnimatedLine
            start={[-4, 0.5, 0]}
            end={[4, 0.5, 0]}
            color="#ff0040"
            delay={0.5}
            width={3}
          />
        </group>
      )
    },
    {
      id: 'future',
      scrollStart: 0.94,
      scrollEnd: 1.0,
      position: [0, -238, 0],
      animation: 'fade',
      content: (
        <FadeInText
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#cccccc"
          maxWidth={20}
          textAlign="center"
          delay={0.2}
        >
          Join us in shaping{'\n'}the future of creative streaming
        </FadeInText>
      )
    }
  ], [])

  return (
    <SmoothScrollPresentation
      pages={16}
      damping={0.15}
      eps={0.001}
      scrollIndicator={true}
      scrollIndicatorStyle={{
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid #ff0040'
      }}
    >
      {/* Noggles overlay - covers screen when scrolling through noggles section */}
      <SimpleNoggleOverlay 
        scrollStart={0.04}
        scrollEnd={0.10}
      />
      
      {/* Security Layer scrambling words effect */}
      <ScramblingWords
        scrollStart={0.38}
        scrollEnd={0.44}
        wordCount={12}
      />
      
      {/* Background particles */}
      <FloatingParticles
        count={80}
        spread={40}
        color="#ff004010"
        size={0.02}
        speed={0.2}
      />
      
      {/* Render all sections */}
      {sections.map((section) => (
        <Section
          key={section.id}
              scrollStart={section.scrollStart}
              scrollEnd={section.scrollEnd}
          position={section.position}
          animation={section.animation}
          animationConfig={section.animationConfig}
        >
          {section.content}
        </Section>
      ))}
      
      {/* Keep the scroll hint */}
      <group position={[0, -240, 0]}>
        <FadeInText
          position={[0, 0, 2]}
          fontSize={0.3}
          color="#666666"
        >
          🖱️ Scroll to explore
        </FadeInText>
      </group>
    </SmoothScrollPresentation>
  )
}

export default ScrollPresentation