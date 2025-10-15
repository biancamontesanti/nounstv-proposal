import React, { useRef, useEffect, useState } from 'react'
import { ScrollControls, Scroll } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

/**
 * SmoothScrollPresentation - Wrapper component for smooth scrolling
 * Similar to the StackBlitz example but for React Three Fiber
 */
function SmoothScrollPresentation({ 
  children, 
  pages = 10,
  damping = 0.1,
  eps = 0.001,
  infinite = false,
  horizontal = false,
  config = {},
  scrollIndicator = true,
  scrollIndicatorStyle = {}
}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const { viewport } = useThree()
  
  // Enhanced smooth scroll configuration
  const scrollConfig = {
    pages,
    damping: damping || config.damping || 0.1,
    eps: eps || config.eps || 0.001,
    infinite,
    horizontal,
    ...config
  }
  
  return (
    <>
      <ScrollControls {...scrollConfig}>
        <Scroll>
          {/* Pass scroll context to children */}
          {children}
        </Scroll>
        
        {/* Optional HTML overlay for UI elements */}
        <Scroll html>
          {scrollIndicator && (
            <ScrollIndicator 
              progress={scrollProgress} 
              style={scrollIndicatorStyle}
            />
          )}
        </Scroll>
      </ScrollControls>
    </>
  )
}

/**
 * ScrollIndicator - Visual indicator of scroll progress
 */
function ScrollIndicator({ progress = 0, style = {} }) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    let timeout
    const handleScroll = () => {
      setIsVisible(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsVisible(false), 2000)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('wheel', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
      clearTimeout(timeout)
    }
  }, [])
  
  const defaultStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '4px',
    height: '60px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    transition: 'opacity 0.3s',
    opacity: isVisible ? 1 : 0.3,
    ...style
  }
  
  const progressStyle = {
    width: '100%',
    height: `${Math.max(10, progress * 100)}%`,
    background: '#ff0040',
    borderRadius: '2px',
    transition: 'height 0.1s ease-out'
  }
  
  return (
    <div style={defaultStyle}>
      <div style={progressStyle} />
    </div>
  )
}

/**
 * ScrollSection - Individual section within the scroll presentation
 */
export function ScrollSection({ 
  children, 
  id,
  className,
  style = {},
  onEnter,
  onExit,
  onProgress
}) {
  const sectionRef = useRef()
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        
        if (inView && onEnter) {
          onEnter()
        } else if (!inView && onExit) {
          onExit()
        }
        
        if (inView && onProgress) {
          onProgress(entry.intersectionRatio)
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [onEnter, onExit, onProgress])
  
  return (
    <div 
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      data-in-view={isInView}
    >
      {children}
    </div>
  )
}

/**
 * ScrollNavigation - Navigation component for jumping between sections
 */
export function ScrollNavigation({ sections = [], style = {} }) {
  const [activeSection, setActiveSection] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index)
          }
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  const defaultStyle = {
    position: 'fixed',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    ...style
  }
  
  return (
    <nav style={defaultStyle}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          style={{
            display: 'block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #ff0040',
            background: activeSection === index ? '#ff0040' : 'transparent',
            margin: '10px 0',
            cursor: 'pointer',
            transition: 'all 0.3s',
            transform: activeSection === index ? 'scale(1.3)' : 'scale(1)',
            padding: 0
          }}
          aria-label={section.label || `Section ${index + 1}`}
        />
      ))}
    </nav>
  )
}

export default SmoothScrollPresentation
