# 🎵 3D Music Visualizer

<img width="959" height="410" alt="Capture d’écran 2026-05-17 212050" src="https://github.com/user-attachments/assets/02bb64d6-ca76-4001-ab25-2b8170b3bd7c" />



An interactive 3D audio visualizer built with Three.js and TypeScript. Users pick a song from their browser and watch it come alive as a real-time 3D animation that reacts to the music.

## Demo

> Run locally to see it in action (see instructions below)

## Features

- 🎧 Load any audio file from your browser
- 🌐 Real-time 3D animation driven by audio frequency data
- ⚡ Smooth, interactive rendering with Three.js
- 🎨 Dynamic visuals that respond to beat and rhythm

## Tech Stack

- **Three.js** — 3D rendering and animation
- **TypeScript** — typed, maintainable codebase
- **Web Audio API** — real-time audio analysis
- **Vite** — fast dev server and bundler

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser, pick a song, and watch it visualize.

## How It Works

The app uses the browser's Web Audio API to analyse the frequency data of the chosen audio file in real time. That data is fed into a Three.js scene every frame, driving the shape, scale, and color of the 3D objects to create visuals that react to the music.
