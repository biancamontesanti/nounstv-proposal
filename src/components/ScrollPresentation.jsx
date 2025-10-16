import React, { useMemo, useEffect, useState } from 'react'
import SmoothScrollPresentation from './SmoothScrollPresentation'
import Section from './Section'
import ScrambleTitle from './ScrambleTitle'
import GridAnimation from './GridAnimation'
import ScramblingWords from './ScramblingWords'
import { NogglesCoverScreen } from './AnimatedNoggles'
import VideoEmbed from './VideoEmbed'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SimpleText, SimpleList } from './SimpleText'
import { MobileText, MobileList } from './MobileText'
import { 
  AnimatedLine, 
  AnimatedBox, 
  FloatingParticles,
  AnimatedGrid 
} from './AnimatedElements'

/**
 * SimpleNoggleOverlay - Simpler version using React Portal
 */
function SimpleNoggleOverlay({ scrollStart, scrollEnd, isMobile = false }) {
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
    const handlePointerMove = (e) => {
      const overlayDiv = document.getElementById('noggles-overlay')
      if (overlayDiv && opacity > 0) {
        const rect = overlayDiv.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
        
        if (isInside) {
          const relativeX = x / rect.width
          setMousePosition({ x: relativeX, isHovered: true })
        } else {
          setMousePosition({ x: 0.5, isHovered: false })
        }
      }
    }
    
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)
    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
    }
  }, [opacity])
  
  useEffect(() => {
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
            <svg
              id="noggles-svg"
              width="320"
              height="320"
              viewBox="0 0 320 320"
              xmlns="http://www.w3.org/2000/svg"
              shape-rendering="crispEdges"
              style="
                filter: drop-shadow(0 0 30px rgba(86, 72, 237, 0.6));
                width: ${isMobile ? '80vw' : '60vw'};
                height: auto;
                position: relative;
                z-index: 1;
                cursor: pointer;
                transition: transform 0.3s ease-out;
                touch-action: manipulation;
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
        const movement = (mousePosition.x - 0.5) * 60
        svgElement.style.transform = `translateX(${movement}%)`
      } else {
        svgElement.style.transform = 'translateX(0)'
      }
    }
  }, [mousePosition])
  
  return null
}

/**
 * ScrollPresentation - Ultra-simple production-ready presentation
 */
function ScrollPresentation({ isMobile = false, viewport = { width: 1920, height: 1080 } }) {
  const [showLoading, setShowLoading] = useState(isMobile)

  // Hide loading screen after delay
  useEffect(() => {
    if (isMobile && showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMobile, showLoading])

  // Choose text component based on mobile
  const TextComponent = isMobile ? MobileText : SimpleText
  const ListComponent = isMobile ? MobileList : SimpleList

  // Define sections with ultra-simple animations
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
            fontSize={isMobile ? 0.8 : 1.2}
          >
            The future belongs to creators
          </ScrambleTitle>
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
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.8 : 1.2}
          color="#5648ed"
          fontWeight={900}
          scrollStart={0.03}
          scrollEnd={0.09}
        >
          Put your noggles on
        </TextComponent>
      )
    },
    {
      id: 'welcome',
      scrollStart: 0.10,
      scrollEnd: 0.15,
      position: [0, -18, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.7 : 0.8}
          color="#ffffff"
          fontWeight={400}
          scrollStart={0.10}
          scrollEnd={0.15}
        >
          This is Nouns TV
        </TextComponent>
      )
    },
    {
      id: 'platform',
      scrollStart: 0.11,
      scrollEnd: 0.16,
      position: [0, -21, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#cccccc"
          fontWeight={300}
          scrollStart={0.11}
          scrollEnd={0.16}
        >
          A complete OTT platform.
        </TextComponent>
      )
    },
    {
      id: 'description',
      scrollStart: 0.13,
      scrollEnd: 0.18,
      position: [0, -30, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, -2, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign={isMobile ? "left" : "center"}
          scrollStart={0.13}
          scrollEnd={0.18}
        >
          {isMobile ? 
            'Where artists, filmmakers,\nand creators can stream\nand protect their content —\nall in one place.' :
            'Where artists, filmmakers, and creators\ncan stream and protect their content — all in one place.'
          }
        </TextComponent>
      )
    },
    {
      id: 'marketplace',
      scrollStart: 0.17,
      scrollEnd: 0.23,
      position: [0, -38, 0],
      animation: 'fade',
      content: (
        <group>
          <TextComponent
            position={[0, 2, 0]}
            fontSize={isMobile ? 0.7 : 0.9}
            color="#ff0040"
            fontWeight={900}
            maxWidth={isMobile ? 16 : 20}
            textAlign={isMobile ? "left" : "center"}
            scrollStart={0.17}
            scrollEnd={0.23}
          >
            {isMobile ? 'With an Integrated\nMarketplace' : 'With an Integrated Marketplace'}
          </TextComponent>
          <ListComponent
            items={
              isMobile ? [
                "Sell and rent\nrecorded content",
                "Buy tickets for\nlive events",
                "Subscribe to\nchannels",
                "Donate to support\ncreators and causes"
              ] : [
                "Creators can sell and rent recorded content",
                "Buy tickets for live events",
                "Subscribe to channels",
                "Make donations to support creators and causes"
              ]
            }
            position={[0, 0, 0]}
            scrollStart={0.17}
            scrollEnd={0.23}
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
      scrollStart: 0.33,
      scrollEnd: 0.39,
      position: [0, -48, 0],
      animation: 'fade',
      content: (
        <group>
          <TextComponent
            position={[0, 2.5, 0]}
            fontSize={isMobile ? 0.7 : 0.9}
            color="#ff0040"
            fontWeight={900}
            maxWidth={isMobile ? 16 : 20}
            textAlign={isMobile ? "left" : "center"}
            scrollStart={0.33}
            scrollEnd={0.39}
          >
            Platform Features
          </TextComponent>
          <ListComponent
            items={
              isMobile ? [
                "4K content streaming",
                "AI-powered subtitles",
                "Channel dashboard",
                "And more"
              ] : [
                "4K content streaming",
                "Artificial intelligence for subtitles",
                "Channel dashboard",
                "And more advanced features"
              ]
            }
            position={[0, 0, 0]}
            scrollStart={0.33}
            scrollEnd={0.39}
          />
        </group>
      )
    },
    {
      id: 'ecosystem',
      scrollStart: 0.40,
      scrollEnd: 0.46,
      position: [0, -58, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign={isMobile ? "left" : "center"}
          scrollStart={0.40}
          scrollEnd={0.46}
        >
          {isMobile ? 
            'Our ecosystem is powered\nby Privy, offering a smooth\nand secure wallet experience\nfor creators and audiences —\nbridging access, content,\nand ownership.' :
            'Our ecosystem is powered by Privy,\noffering a smooth and secure wallet experience\nfor creators and audiences alike —\nbridging access, content, and ownership.'
          }
        </TextComponent>
      )
    },
    {
      id: 'screens',
      scrollStart: 0.47,
      scrollEnd: 0.53,
      position: [0, -68, 0],
      animation: 'fade',
      content: (
        <group>
          <TextComponent
            position={[0, 2, 0]}
            fontSize={isMobile ? 0.7 : 0.9}
            color="#ff0040"
            fontWeight={900}
            maxWidth={isMobile ? 16 : 20}
            textAlign={isMobile ? "left" : "center"}
            scrollStart={0.47}
            scrollEnd={0.53}
          >
            {isMobile ? 'Optimized for\nEvery Screen' : 'Optimized for Every Screen'}
          </TextComponent>
          <TextComponent
            position={[0, 0, 0]}
            fontSize={isMobile ? 0.4 : 0.5}
            color="#ffffff"
            maxWidth={isMobile ? 16 : 20}
            textAlign={isMobile ? "left" : "center"}
            fontWeight={400}
            scrollStart={0.47}
            scrollEnd={0.53}
          >
            {isMobile ? 
              'Web browsers, Smart TVs,\nApple TV, iOS devices,\nand Android.' :
              'Web, Smart TVs, Apple TV,\niOS, and Android.'
            }
          </TextComponent>
        </group>
      )
    },
    {
      id: 'art-statement',
      scrollStart: 0.40,
      scrollEnd: 0.44,
      position: [0, -88, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.45 : 0.6}
          color="#cccccc"
          fontWeight={400}
          maxWidth={isMobile ? 16 : 20}
          scrollStart={0.40}
          scrollEnd={0.44}
        >
          {isMobile ? 
            'We understand that\ndigital content\nis a work of art.' :
            'We understand that digital content is a work of art.'
          }
        </TextComponent>
      )
    },
    {
      id: 'protection',
      scrollStart: 0.46,
      scrollEnd: 0.50,
      position: [0, -98, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.45 : 0.6}
          color="#ff0040"
          fontWeight={900}
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.46}
          scrollEnd={0.50}
        >
          {isMobile ? 'We do everything\nto protect it.' : 'And we do everything to protect it.'}
        </TextComponent>
      )
    },
    {
      id: 'security',
      scrollStart: 0.54,
      scrollEnd: 0.60,
      position: [0, -78, 0],
      animation: 'fade',
      content: (
        <group>
          <ListComponent
            items={[
              "Anti-piracy protection",
              "End-to-end encryption",
              "DRM certification"
            ]}
            position={[0, 0, 0]}
            scrollStart={0.54}
            scrollEnd={0.60}
          />
        </group>
      )
    },
    {
      id: 'worldwide',
      scrollStart: 0.50,
      scrollEnd: 0.56,
      position: [0, -115, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.50}
          scrollEnd={0.56}
        >
          {isMobile ? 
            'Everything creators need\nto share their content\nsafely — worldwide.' :
            'Everything creators need to share\ntheir content safely — worldwide.'
          }
        </TextComponent>
      )
    },
    {
      id: 'history',
      scrollStart: 0.58,
      scrollEnd: 0.64,
      position: [0, -130, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.8 : 1}
          color="#ff0040"
          fontWeight={900}
          scrollStart={0.58}
          scrollEnd={0.64}
        >
          Our origin
        </TextComponent>
      )
    },
    {
      id: 'pandemic',
      scrollStart: 0.62,
      scrollEnd: 0.68,
      position: [0, -140, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.62}
          scrollEnd={0.68}
        >
          {isMobile ? 
            'During the pandemic,\nartists lost\ntheir stages.' :
            'During the pandemic,\nartists lost their stages.'
          }
        </TextComponent>
      )
    },
    {
      id: 'soundclub',
      scrollStart: 0.66,
      scrollEnd: 0.72,
      position: [0, -150, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.66}
          scrollEnd={0.72}
        >
          {isMobile ? 
            'SoundClub was our answer —\na live streaming tool\nwith built-in payments\nthat kept music alive\nwhen the world stopped.' :
            'SoundClub was our answer —\na live streaming tool with\nbuilt-in payments\nthat kept music alive when\nthe world stopped.'
          }
        </TextComponent>
      )
    },
    {
      id: 'stats',
      scrollStart: 0.70,
      scrollEnd: 0.76,
      position: [0, -160, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#ffffff"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          fontWeight={400}
          scrollStart={0.70}
          scrollEnd={0.76}
        >
          {isMobile ? 
            'Thousands of live shows.\nHundreds of creators.\nMillions of memories —\nall online.' :
            'Thousands of live shows.\nHundreds of creators.\nMillions of memories — all online.'
          }
        </TextComponent>
      )
    },
    {
      id: 'origin',
      scrollStart: 0.74,
      scrollEnd: 0.80,
      position: [0, -170, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.74}
          scrollEnd={0.80}
        >
          {isMobile ? 
            'What began as survival\nbecame innovation.\n\nA secure, scalable platform\nfor creators worldwide.' :
            'What began as survival\nbecame innovation.\n\nA secure, scalable platform\nfor creators worldwide.'
          }
        </TextComponent>
      )
    },
    {
      id: 'innovation',
      scrollStart: 0.78,
      scrollEnd: 0.84,
      position: [0, -180, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.78}
          scrollEnd={0.84}
        >
          Born in Rio de Janeiro,\nbuilt for the world.
        </TextComponent>
      )
    },
    {
      id: 'together',
      scrollStart: 0.84,
      scrollEnd: 0.88,
      position: [0, -198, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.84}
          scrollEnd={0.88}
        >
          {isMobile ? 
            'Together,\nwe can bring\nsecure streaming\nand on-demand experiences\nto every creator.' :
            'Together,\nwe can bring secure streaming\nand on-demand experiences\nto every creator.'
          }
        </TextComponent>
      )
    },
    {
      id: 'gratitude',
      scrollStart: 0.86,
      scrollEnd: 0.90,
      position: [0, -206, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#ffffff"
          fontWeight={400}
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.86}
          scrollEnd={0.90}
        >
          {isMobile ? 
            'Our team is grateful\nfor your support.' :
            'Our team is grateful for your support.'
          }
        </TextComponent>
      )
    },
    {
      id: 'vote',
      scrollStart: 0.88,
      scrollEnd: 0.94,
      position: [0, -214, 0],
      animation: 'fade',
      content: (
        <group>
          <TextComponent
            position={[0, 2, 0]}
            fontSize={isMobile ? 0.85 : 1.2}
            color="#ff0040"
            fontWeight={900}
            maxWidth={isMobile ? 16 : 20}
            textAlign="center"
            scrollStart={0.88}
            scrollEnd={0.94}
          >
            {isMobile ? 'Vote for\nNouns TV' : 'Vote for Nouns TV'}
          </TextComponent>
          <AnimatedLine
            start={isMobile ? [-3, 0.5, 0] : [-4, 0.5, 0]}
            end={isMobile ? [3, 0.5, 0] : [4, 0.5, 0]}
            color="#ff0040"
            delay={0.5}
            width={isMobile ? 2 : 3}
          />
        </group>
      )
    },
    {
      id: 'future',
      scrollStart: 0.92,
      scrollEnd: 1.0,
      position: [0, -222, 0],
      animation: 'fade',
      content: (
        <TextComponent
          position={[0, 0, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#cccccc"
          maxWidth={isMobile ? 16 : 20}
          textAlign="center"
          scrollStart={0.92}
          scrollEnd={1.0}
        >
          {isMobile ? 
            'Join us in shaping\nthe future of\ncreative streaming' :
            'Join us in shaping\nthe future of creative streaming'
          }
        </TextComponent>
      )
    }
  ], [isMobile])

  return (
    <>
      {/* Mobile loading indicator */}
      {isMobile && showLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          opacity: showLoading ? 1 : 0,
          transition: 'opacity 0.5s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#fff',
            fontFamily: 'Londrina Solid, Arial, sans-serif'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '20px' }}>👓</div>
            <div style={{ fontSize: '18px', fontWeight: 300 }}>Loading Nouns TV...</div>
          </div>
        </div>
      )}
      
      <SmoothScrollPresentation
        pages={16}
        damping={0.15}
        eps={0.001}
        scrollIndicator={true}
        scrollIndicatorStyle={{
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid #ff0040'
        }}
        isMobile={isMobile}
      >
      {/* Noggles overlay */}
      <SimpleNoggleOverlay 
        scrollStart={0.04}
        scrollEnd={0.10}
        isMobile={isMobile}
      />
      
      {/* YouTube video embed */}
      <VideoEmbed
        scrollStart={0.20}
        scrollEnd={0.32}
        videoId="qnQOGS3wd0c"
        isMobile={isMobile}
      />
      
      {/* Security Layer scrambling words effect */}
      <ScramblingWords
        scrollStart={0.50}
        scrollEnd={0.56}
        wordCount={12}
      />
      
      {/* Background particles */}
      <FloatingParticles
        count={80}
        spread={40}
        color="#ff0040"
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
      
      {/* Scroll hint */}
      <group position={[0, -240, 0]}>
        <TextComponent
          position={[0, 0, 2]}
          fontSize={isMobile ? 0.3 : 0.3}
          color="#666666"
          fontWeight={300}
          scrollStart={0.95}
          scrollEnd={1.0}
        >
          {isMobile ? '👆 Swipe to explore' : '🖱️ Scroll to explore'}
        </TextComponent>
      </group>
      </SmoothScrollPresentation>
    </>
  )
}

export default ScrollPresentation