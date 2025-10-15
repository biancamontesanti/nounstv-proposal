# Nouns TV - Dynamic Three.js Presentation

A dynamic, interactive presentation for a video streaming platform built with React Three Fiber, featuring:

- ✨ **Black background with white text and red accents**
- 🌟 **Unreal Bloom post-processing effects**
- 🎯 **Animated bullet points with smooth transitions**
- 🎮 **Interactive navigation (arrow keys or auto-advance)**
- 📱 **Responsive 3D environment**

## Features

- **Dynamic Animations**: Bullet points animate in with scale and position transitions
- **Post-Processing**: Unreal Bloom effect for glowing red accent elements
- **Interactive Controls**: Keyboard navigation and orbital camera controls
- **Auto-Advance**: Slides automatically transition every 8 seconds
- **3D Particles**: Floating red particles for visual depth
- **Slide Indicators**: Visual progress indicator at the bottom

## Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Navigation

- **Right Arrow / Space**: Next slide
- **Left Arrow**: Previous slide
- **Mouse**: Orbit around the presentation
- **Scroll**: Zoom in/out

## Technology Stack

- **Vite**: Build tool and dev server
- **React**: UI framework
- **React Three Fiber**: Three.js React integration
- **@react-three/drei**: Useful Three.js helpers
- **@react-three/postprocessing**: Post-processing effects
- **Three.js**: 3D graphics library

## Project Structure

```
src/
├── App.jsx                 # Main app with Canvas and post-processing
├── components/
│   ├── Presentation.jsx    # Main presentation controller
│   └── BulletPoint.jsx     # Individual animated bullet points
└── main.jsx               # React entry point
```

The presentation automatically cycles through the Nouns TV content slides with beautiful animations and effects.
