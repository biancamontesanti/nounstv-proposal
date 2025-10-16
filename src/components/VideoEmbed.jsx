import React, { useEffect, useState } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/**
 * VideoEmbed - Component to embed YouTube videos in the scroll presentation
 */
function VideoEmbed({ scrollStart, scrollEnd, videoId, isMobile = false }) {
  const scroll = useScroll()
  const [opacity, setOpacity] = useState(0)
  const [scale, setScale] = useState(0.8)
  
  useFrame(() => {
    if (scroll) {
      const scrollOffset = scroll.offset
      
      if (scrollOffset >= scrollStart && scrollOffset <= scrollEnd) {
        const sectionProgress = (scrollOffset - scrollStart) / (scrollEnd - scrollStart)
        
        let newOpacity, newScale
        if (sectionProgress < 0.15) {
          // Quick fade in
          newOpacity = sectionProgress / 0.15
          newScale = 0.9 + (0.1 * (sectionProgress / 0.15))
        } else if (sectionProgress > 0.85) {
          // Quick fade out
          const fadeProgress = (sectionProgress - 0.85) / 0.15
          newOpacity = 1 - fadeProgress
          newScale = 1 + (fadeProgress * 0.1)
        } else {
          // Stay fully visible for most of the scroll range
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
    // Create video overlay div if it doesn't exist
    let videoDiv = document.getElementById('video-overlay')
    if (!videoDiv) {
      videoDiv = document.createElement('div')
      videoDiv.id = 'video-overlay'
      videoDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${isMobile ? '90vw' : '60vw'};
        max-width: 800px;
        aspect-ratio: 16 / 9;
        pointer-events: none;
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      `
      document.body.appendChild(videoDiv)
    }
    
    return () => {
      const div = document.getElementById('video-overlay')
      if (div && div.parentNode) {
        document.body.removeChild(div)
      }
    }
  }, [isMobile])
  
  useEffect(() => {
    const videoDiv = document.getElementById('video-overlay')
    if (videoDiv) {
      videoDiv.style.opacity = opacity
      videoDiv.style.transform = `translate(-50%, -50%) scale(${scale})`
      videoDiv.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
      
      if (opacity > 0 && !videoDiv.querySelector('iframe')) {
        videoDiv.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            border-radius: ${isMobile ? '12px' : '16px'};
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(255, 0, 64, 0.3);
            border: 2px solid #ff0040;
          ">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              style="display: block;"
            ></iframe>
          </div>
        `
      }
    }
  }, [opacity, scale, videoId, isMobile])
  
  return null
}

export default VideoEmbed

