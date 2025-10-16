import React, { useRef, useEffect, useState } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/**
 * ScramblingWords - Security-themed scrambling text effect
 * Creates words that appear at random positions, scramble with random characters,
 * then reveal the actual word before disappearing
 */
function ScramblingWords({ scrollStart, scrollEnd, wordCount = 8 }) {
  const containerRef = useRef()
  const scroll = useScroll()
  const [words, setWords] = useState([])
  const [isActive, setIsActive] = useState(false)
  
  // Security-themed words to scramble
  const securityWords = [
    'ENCRYPTED', 'SECURE', 'PROTECTED', 'SAFE', 'PRIVATE',
    'LOCKED', 'SHIELDED', 'DEFENDED', 'GUARDED', 'SECURED',
    'ENCODED', 'AUTHENTICATED', 'VERIFIED', 'TRUSTED', 'SECRET',
    'FIREWALL', 'ANTIVIRUS', 'BLOCKCHAIN', 'CIPHER', 'KEY',
    'ACCESS', 'CONTROL', 'VALIDATION', 'INTEGRITY', 'CONFIDENTIAL'
  ]
  
  // Character sets for scrambling
  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
  
  // Generate random characters for scrambling
  const getRandomChar = () => {
    const allChars = Object.values(characterSets).join('')
    return allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Create a new scrambling word
  const createWord = () => {
    const word = securityWords[Math.floor(Math.random() * securityWords.length)]
    const position = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }
    
    return {
      id: Date.now() + Math.random(),
      originalWord: word,
      currentText: '',
      position,
      phase: 'scrambling', // 'scrambling', 'revealing', 'visible', 'fading'
      scrambleProgress: 0,
      revealProgress: 0,
      visibleTime: 0,
      fadeProgress: 0,
      speed: 0.02 + Math.random() * 0.03, // Random speed variation
      fontSize: 16 + Math.random() * 12, // Random size variation
      rotation: 0 // Keep horizontal - no rotation
    }
  }
  
  // Initialize words when component mounts
  useEffect(() => {
    const initialWords = []
    for (let i = 0; i < wordCount; i++) {
      initialWords.push(createWord())
    }
    setWords(initialWords)
  }, [wordCount])
  
  // Create overlay container
  useEffect(() => {
    let overlayDiv = document.getElementById('scrambling-words-overlay')
    if (!overlayDiv) {
      overlayDiv = document.createElement('div')
      overlayDiv.id = 'scrambling-words-overlay'
      overlayDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 1000;
        font-family: 'Courier New', monospace;
        font-weight: bold;
      `
      document.body.appendChild(overlayDiv)
      containerRef.current = overlayDiv
    }
    
    return () => {
      const div = document.getElementById('scrambling-words-overlay')
      if (div) {
        document.body.removeChild(div)
      }
    }
  }, [])
  
  useFrame(() => {
    if (!scroll) return
    
    const scrollOffset = scroll.offset
    
    // Check if we're in the active scroll range
    if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
      if (!isActive) {
        setIsActive(true)
      }
      
      // Update each word
      setWords(prevWords => {
        return prevWords.map(word => {
          const newWord = { ...word }
          
          switch (newWord.phase) {
            case 'scrambling':
              // Generate scrambling text
              newWord.scrambleProgress += newWord.speed
              if (newWord.scrambleProgress >= 1) {
                newWord.phase = 'revealing'
                newWord.revealProgress = 0
              } else {
                // Create scrambled text
                const scrambleLength = Math.floor(newWord.scrambleProgress * newWord.originalWord.length)
                const scrambledPart = Array.from({ length: scrambleLength }, () => getRandomChar()).join('')
                const remainingPart = newWord.originalWord.slice(scrambleLength)
                newWord.currentText = scrambledPart + remainingPart
              }
              break
              
            case 'revealing':
              // Reveal the actual word character by character
              newWord.revealProgress += newWord.speed * 2
              if (newWord.revealProgress >= 1) {
                newWord.phase = 'visible'
                newWord.currentText = newWord.originalWord
                newWord.visibleTime = 0
              } else {
                const revealLength = Math.floor(newWord.revealProgress * newWord.originalWord.length)
                const revealedPart = newWord.originalWord.slice(0, revealLength)
                const scrambledPart = Array.from({ 
                  length: newWord.originalWord.length - revealLength 
                }, () => getRandomChar()).join('')
                newWord.currentText = revealedPart + scrambledPart
              }
              break
              
            case 'visible':
              // Keep the word visible for a moment
              newWord.visibleTime += newWord.speed * 10
              if (newWord.visibleTime >= 1) {
                newWord.phase = 'fading'
                newWord.fadeProgress = 0
              }
              break
              
            case 'fading':
              // Fade out and create new word
              newWord.fadeProgress += newWord.speed * 2
              if (newWord.fadeProgress >= 1) {
                // Replace with new word
                return createWord()
              }
              break
          }
          
          return newWord
        })
      })
    } else {
      if (isActive) {
        setIsActive(false)
        // Reset all words when out of scroll range
        setWords(prevWords => prevWords.map(() => createWord()))
      }
    }
  })
  
  // Render words to HTML overlay
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    container.innerHTML = ''
    
      words.forEach((word) => {
        // Calculate opacity based on phase and scroll position
        let opacity = 0
        let color = '#000000' // Default black to match background
        
        if (isActive) {
          // Only show red color when section is active
          color = '#ff0040'
          
          // Enhanced emerge effect with smooth transitions
          switch (word.phase) {
            case 'scrambling':
              opacity = 0.4 * (0.2 + word.scrambleProgress * 0.8) // Start very subtle, build up
              break
            case 'revealing':
              opacity = 0.4 * (0.8 + word.revealProgress * 0.2) // Peak opacity during reveal
              break
            case 'visible':
              opacity = 0.4 // Full visibility
              break
            case 'fading':
              opacity = 0.4 * (1 - word.fadeProgress * word.fadeProgress) // Smooth fade with easing
              break
          }
        } else {
          // When section is not active, make completely invisible
          opacity = 0
          color = '#000000'
        }
        
        const wordElement = document.createElement('div')
        wordElement.textContent = word.currentText || word.originalWord
        
        // Enhanced emerge/fade effects
        let scale = 0.8 + Math.sin(Date.now() * 0.001 + word.id) * 0.2
        let blur = Math.sin(Date.now() * 0.002 + word.id) * 0.5
        let letterSpacing = Math.sin(Date.now() * 0.003 + word.id) * 2
        let glowIntensity = 1
        
        if (isActive) {
          // Emerge effect - start small and blurry, become clear and larger
          if (word.phase === 'scrambling') {
            scale = 0.6 + (word.scrambleProgress * 0.4) + Math.sin(Date.now() * 0.001 + word.id) * 0.1
            blur = 2 - (word.scrambleProgress * 1.5) + Math.sin(Date.now() * 0.002 + word.id) * 0.3
            glowIntensity = 0.5 + word.scrambleProgress * 0.5
          } else if (word.phase === 'revealing') {
            scale = 1.0 + (word.revealProgress * 0.1) + Math.sin(Date.now() * 0.001 + word.id) * 0.15
            blur = 0.5 - (word.revealProgress * 0.3) + Math.sin(Date.now() * 0.002 + word.id) * 0.2
            glowIntensity = 1
          } else if (word.phase === 'visible') {
            scale = 1.1 + Math.sin(Date.now() * 0.001 + word.id) * 0.2
            blur = 0.2 + Math.sin(Date.now() * 0.002 + word.id) * 0.3
            glowIntensity = 1
          } else if (word.phase === 'fading') {
            // Fade out effect - become smaller, blurrier, and less glowing
            scale = 1.1 - (word.fadeProgress * 0.5) + Math.sin(Date.now() * 0.001 + word.id) * 0.1
            blur = 0.2 + (word.fadeProgress * 1.8) + Math.sin(Date.now() * 0.002 + word.id) * 0.2
            glowIntensity = 1 - word.fadeProgress
          }
        }
        
        wordElement.style.cssText = `
          position: absolute;
          left: ${word.position.x}px;
          top: ${word.position.y}px;
          font-size: ${word.fontSize}px;
          color: ${color};
          opacity: ${opacity};
          text-shadow: ${color === '#ff0040' ? `0 0 ${10 * glowIntensity}px #ff0040, 0 0 ${20 * glowIntensity}px #ff0040, 0 0 ${30 * glowIntensity}px #ff0040` : 'none'};
          transform: scale(${scale});
          white-space: nowrap;
          user-select: none;
          transition: opacity 0.1s ease-out, transform 0.1s ease-out;
          filter: blur(${blur}px);
          letter-spacing: ${letterSpacing}px;
        `
        
        container.appendChild(wordElement)
      })
    }, [words, isActive])
  
  return null // This component renders to HTML overlay, not 3D scene
}

export default ScramblingWords
