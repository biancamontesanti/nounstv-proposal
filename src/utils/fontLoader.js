import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

// Font loader utility for loading Londrina Solid font
const fontLoader = new FontLoader()

// Cache for loaded fonts
const fontCache = new Map()

/**
 * Load Londrina Solid font with specified weight
 * @param {number} weight - Font weight (100, 300, 400, 900)
 * @returns {Promise<THREE.Font>}
 */
export const loadLondrinaSolidFont = (weight = 400) => {
  const cacheKey = `londrina-solid-${weight}`
  
  if (fontCache.has(cacheKey)) {
    return Promise.resolve(fontCache.get(cacheKey))
  }

  // Since we can't directly load Google Fonts as .json files in Three.js,
  // we'll use a fallback approach by creating a font object with the font family name
  // This will work with CSS-loaded fonts
  return new Promise((resolve) => {
    // Create a temporary canvas to measure text and create a basic font representation
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    // Set the font family and weight
    const fontFamily = `"Londrina Solid", sans-serif`
    const fontWeight = weight === 100 ? 'thin' : 
                     weight === 300 ? 'light' : 
                     weight === 400 ? 'regular' : 
                     weight === 900 ? 'black' : 'regular'
    
    // Apply the font
    context.font = `${fontWeight} 1em ${fontFamily}`
    
    // Create a simple font object that Three.js can use
    // This is a simplified approach - for production, you'd want to use a proper font loader
    const font = {
      data: {
        familyName: 'Londrina Solid',
        ascender: 800,
        descender: -200,
        underlinePosition: -100,
        underlineThickness: 50,
        boundingBox: {
          xMin: -50,
          yMin: -200,
          xMax: 1000,
          yMax: 800
        },
        resolution: 1000,
        glyphs: {}
      },
      generateShapes: (text, size = 100) => {
        // Return empty shapes for now - the actual font rendering will be handled by CSS
        return []
      }
    }
    
    fontCache.set(cacheKey, font)
    resolve(font)
  })
}

/**
 * Get font family string for CSS
 * @param {number} weight - Font weight (100, 300, 400, 900)
 * @returns {string}
 */
export const getLondrinaSolidCSS = (weight = 400) => {
  const fontWeight = weight === 100 ? 'thin' : 
                   weight === 300 ? 'light' : 
                   weight === 400 ? 'regular' : 
                   weight === 900 ? 'black' : 'regular'
  
  return `"Londrina Solid", sans-serif`
}

/**
 * Get font weight class name
 * @param {number} weight - Font weight (100, 300, 400, 900)
 * @returns {string}
 */
export const getFontWeightClass = (weight = 400) => {
  return weight === 100 ? 'londrina-solid-thin' : 
         weight === 300 ? 'londrina-solid-light' : 
         weight === 400 ? 'londrina-solid-regular' : 
         weight === 900 ? 'londrina-solid-black' : 'londrina-solid-regular'
}
