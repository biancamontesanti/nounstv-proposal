# ScrollPresentation Modular System Guide

## Overview
Your ScrollPresentation has been transformed into a modular, component-based system that makes it easy to create and customize scroll-triggered animations. The architecture is similar to your ScrambleTitle component - reusable, configurable, and composable.

## Key Components

### 1. **SmoothScrollPresentation** (Wrapper)
The main container that provides smooth scrolling functionality.

```jsx
<SmoothScrollPresentation
  pages={16}        // Number of virtual pages
  damping={0.15}    // Smoothness (0.1-0.3 recommended)
  eps={0.001}       // Precision
  scrollIndicator={true}  // Show scroll progress
>
  {/* Your sections here */}
</SmoothScrollPresentation>
```

### 2. **Section** (Container)
Individual scroll-triggered sections with built-in animations.

```jsx
<Section
  scrollStart={0}     // When to start (0-1)
  scrollEnd={0.2}     // When to end (0-1)
  position={[0, 0, 0]}  // 3D position
  animation="fade"    // 'fade', 'slide', 'scale', 'rotate', 'none'
  animationConfig={{  // Optional animation settings
    duration: 0.8,
    ease: "power2.out",
    slideFrom: -5,    // For slide animation
    rotateFrom: Math.PI/4  // For rotate animation
  }}
  onEnter={(ref) => {}}    // Callback when entering
  onExit={(ref) => {}}     // Callback when exiting
  onProgress={(p) => {}}   // Progress callback
>
  {/* Your content */}
</Section>
```

### 3. **Text Animation Components**

#### FadeInText
```jsx
<FadeInText
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  delay={0}
  duration={0.8}
>
  Your text here
</FadeInText>
```

#### SlideInText
```jsx
<SlideInText
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  from="left"  // 'left', 'right', 'top', 'bottom'
  distance={3}
  delay={0}
>
  Sliding text
</SlideInText>
```

#### TypewriterText
```jsx
<TypewriterText
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  speed={50}  // ms per character
  delay={0}
>
  Types out letter by letter
</TypewriterText>
```

#### GlitchText
```jsx
<GlitchText
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  glitchColor="#ff0040"
  intensity={0.5}
>
  Glitchy text effect
</GlitchText>
```

#### PulseText
```jsx
<PulseText
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  pulseSpeed={2}
  pulseAmount={0.1}
>
  Pulsing text
</PulseText>
```

### 4. **Animated Elements**

#### AnimatedLine
```jsx
<AnimatedLine
  start={[-3, 0, 0]}
  end={[3, 0, 0]}
  color="#ff0040"
  duration={1}
  delay={0}
  width={2}
/>
```

#### AnimatedBox
```jsx
<AnimatedBox
  position={[0, 0, 0]}
  size={[1, 1, 1]}
  color="#ffffff"
  animation="scale"  // 'scale', 'rotate', 'bounce'
  duration={0.8}
  delay={0}
/>
```

#### AnimatedGrid
```jsx
<AnimatedGrid
  rows={3}
  cols={3}
  spacing={1.5}
  position={[0, 0, 0]}
  elementSize={0.3}
  color="#ff0040"
  animation="wave"  // 'wave', 'random', 'spiral'
  duration={2}
/>
```

#### FloatingParticles
```jsx
<FloatingParticles
  count={50}
  spread={20}
  color="#ffffff"
  size={0.05}
  speed={0.5}
/>
```

## Creating Custom Sections

### Example 1: Hero Section
```jsx
<Section
  scrollStart={0}
  scrollEnd={0.2}
  position={[0, 0, 0]}
  animation="fade"
>
  <ScrambleTitle position={[0, 2, 0]} scrollStart={0} scrollEnd={0.2}>
    Amazing Title
  </ScrambleTitle>
  <AnimatedLine start={[-3, 0, 0]} end={[3, 0, 0]} delay={1} />
  <FadeInText position={[0, -1, 0]} delay={1.5}>
    Subtitle text
  </FadeInText>
</Section>
```

### Example 2: Feature List
```jsx
<Section
  scrollStart={0.2}
  scrollEnd={0.4}
  position={[0, -10, 0]}
  animation="slide"
>
  <PulseText position={[0, 2, 0]} fontSize={1}>
    Features
  </PulseText>
  <BulletList
    items={["Feature 1", "Feature 2", "Feature 3"]}
    position={[0, 0, 0]}
    delay={0.5}
  />
</Section>
```

### Example 3: Interactive Section
```jsx
<Section
  scrollStart={0.4}
  scrollEnd={0.6}
  position={[0, -20, 0]}
  animation="scale"
  onEnter={() => console.log('Entered!')}
  onProgress={(progress) => {
    // Do something with progress (0-1)
  }}
>
  <GlitchText position={[0, 0, 0]}>
    Interactive Content
  </GlitchText>
  <AnimatedGrid
    rows={3}
    cols={3}
    animation="spiral"
  />
  <FloatingParticles count={30} />
</Section>
```

## Tips for Best Results

1. **Scroll Ranges**: Keep scrollStart and scrollEnd ranges small (0.1-0.2 difference) for better control
2. **Positioning**: Use the y-position to stack sections vertically
3. **Delays**: Chain animations using the delay prop for sequential effects
4. **Performance**: Limit particle counts and complex animations for better performance
5. **Testing**: Use the browser's scroll indicator to fine-tune scroll ranges

## Smooth Scrolling Configuration

The smooth scrolling is achieved through the `damping` parameter:
- **0.05-0.1**: Very smooth, slow scrolling
- **0.1-0.2**: Balanced smoothness (recommended)
- **0.2-0.3**: Less smooth, more responsive
- **0.3+**: Almost instant, minimal smoothing

## Adding New Animation Types

To create a custom animation component:

1. Import necessary hooks and libraries
2. Create a component with ref and animation logic
3. Use useEffect for initialization
4. Use useFrame for continuous animations
5. Export and use in sections

Example custom component:
```jsx
export function CustomAnimatedText({ children, position, ...props }) {
  const textRef = useRef()
  
  useEffect(() => {
    // Initialize animation
    gsap.fromTo(textRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 1 }
    )
  }, [])
  
  return (
    <Text ref={textRef} position={position} {...props}>
      {children}
    </Text>
  )
}
```

## Integration with Existing Code

Your ScrambleTitle component remains untouched and can be used as-is:
```jsx
<ScrambleTitle
  position={[0, 0, 0]}
  scrollStart={0}
  scrollEnd={0.1}
  delay={1}
>
  Your scramble text
</ScrambleTitle>
```

The system is designed to work seamlessly with your existing components while providing new animation capabilities.
