# Maestro - Adaptive Music System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Maestro is a TypeScript library for creating adaptive music systems, inspired by LucasArts' revolutionary iMUSE (Interactive Music Streaming Engine) technology. It provides seamless musical transitions, dynamic tempo and key matching, and optional integration with blockchain gaming platforms.

## 🎵 Features

- **Seamless Musical Transitions**: Smooth transitions between musical cues with bar-synchronized timing
- **Dynamic Tempo & Key Matching**: Automatic tempo and key adjustment for musical coherence
- **Layer-Based Audio Management**: Independent control of multiple audio layers/channels
- **Volume Fading**: Smooth fade-in/fade-out capabilities for individual layers
- **Blockchain Integration**: Optional Torii integration for blockchain gaming scenarios
- **TypeScript First**: Full TypeScript support with comprehensive type definitions
- **React Hooks**: Easy integration with React applications via custom hooks

## 📦 Installation

```bash
npm install maestro
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { useImuse } from "maestro";

function MyComponent() {
  const { playInitialCue, transitionToCue, currentCue } = useImuse();

  const introCue = {
    id: "intro_theme",
    key: 0, // C major
    tempo: 120,
    entryPoints: [0, 1920], // Bar boundaries for transitions
    layers: [
      { id: "piano", channel: 0, volume: 100 },
      { id: "strings", channel: 1, volume: 80 },
    ],
  };

  const combatCue = {
    id: "combat_theme",
    key: 2, // D major
    tempo: 140,
    entryPoints: [0, 960],
    layers: [
      { id: "brass", channel: 0, volume: 120 },
      { id: "drums", channel: 1, volume: 110 },
    ],
  };

  const handleCombatStart = () => {
    transitionToCue(combatCue, {
      waitForBar: true, // Wait for next bar boundary
      matchKey: true, // Transpose to match current key
      matchTempo: true, // Gradually adjust tempo
    });
  };

  return (
    <div>
      <button onClick={() => playInitialCue(introCue)}>Start Intro</button>
      <button onClick={handleCombatStart}>Start Combat</button>
      <p>Current cue: {currentCue?.id}</p>
    </div>
  );
}
```

### With Torii Integration

```typescript
import { useImuse } from "maestro";

function GameComponent() {
  const { playInitialCue, transitionToCue } = useImuse({ withTorii: true });

  // Automatically responds to combat scene changes in your blockchain game
  // The hook will listen for Torii events and trigger appropriate music transitions

  return <div>Your game content</div>;
}
```

## 📚 API Reference

### Core Types

#### `Cue`

Represents a musical cue with timing and layer information.

```typescript
interface Cue {
  id: string; // Unique identifier
  key: number; // MIDI pitch class (0=C, 1=C#/Db, etc.)
  tempo: number; // BPM
  entryPoints: number[]; // Bar/tick offsets for transitions
  layers: CueLayer[]; // Audio layers/channels
}
```

#### `CueLayer`

Defines an individual audio layer within a cue.

```typescript
interface CueLayer {
  id: string; // Layer identifier
  channel: number; // MIDI channel number
  volume: number; // Initial volume (0-127)
  muted?: boolean; // Optional mute state
}
```

### React Hook

#### `useImuse(options?)`

Main React hook for managing adaptive music.

**Parameters:**

- `options.withTorii?: boolean` - Enable Torii blockchain integration

**Returns:**

```typescript
{
  playInitialCue: (cue: Cue) => void;
  transitionToCue: (cue: Cue, options: TransitionOptions) => void;
  fadeIn: (channel: number, duration: number) => void;
  fadeOut: (channel: number, duration: number) => void;
  currentCue: Cue | null;
  pendingCue: Cue | null;
}
```

### Transition Options

```typescript
interface TransitionOptions {
  waitForBar?: boolean; // Wait for next bar boundary
  matchKey?: boolean; // Transpose to match current key
  matchTempo?: boolean; // Gradually adjust tempo
}
```

### Utility Functions

#### `createCueFromMidi(id: string, midi: any): Cue`

Converts a parsed MIDI file into a Maestro cue object.

```typescript
import { createCueFromMidi } from "maestro";

const midiData = parseMidiFile(midiFile);
const cue = createCueFromMidi("my_cue", midiData);
```

## 🏗️ Architecture

Maestro is built with a modular architecture consisting of several core components:

### Core Components

1. **Transport** (`src/transport.ts`)

   - Manages musical timing and tempo
   - Handles tick-based timing system
   - Provides bar boundary calculations

2. **Scheduler** (`src/scheduler.ts`)

   - Manages cue playback and layer states
   - Handles volume fading for individual layers
   - Coordinates with audio/MIDI engines

3. **Transition Manager** (`src/transition.ts`)

   - Orchestrates smooth transitions between cues
   - Implements bar-synchronized timing
   - Handles tempo and key matching

4. **Torii Integration** (`src/toriiListeners.ts`)
   - Optional blockchain gaming integration
   - Listens for game state changes
   - Triggers appropriate musical responses

### Data Flow

```
Game Events → Torii Listener → Transition Manager → Scheduler → Audio Engine
     ↓              ↓              ↓              ↓           ↓
  React Hook → Cue Selection → Timing Logic → Layer Control → Sound Output
```

## 🎮 Use Cases

### Video Games

- **Dynamic Soundtracks**: Music that adapts to gameplay intensity
- **Seamless Transitions**: No jarring musical cuts during gameplay
- **Mood-Based Music**: Different themes for exploration, combat, dialogue

### Interactive Media

- **Web Applications**: Background music that responds to user interactions
- **Educational Content**: Music that adapts to learning progress
- **Virtual Reality**: Immersive audio experiences

### Blockchain Gaming

- **On-Chain Events**: Music that responds to smart contract events
- **Player Actions**: Dynamic soundtracks based on player decisions
- **Game State**: Musical themes that reflect current game conditions

## 🔧 Development

### Prerequisites

- Node.js 16+
- TypeScript 4.5+

### Setup

```bash
git clone https://github.com/your-username/maestro.git
cd maestro
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Testing

```bash
# Run the test example
npx ts-node src/testMaestro.ts
```

## 📁 Project Structure

```
maestro/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript type definitions
│   ├── useImuse.ts           # React hook implementation
│   ├── transport.ts          # Musical timing system
│   ├── scheduler.ts          # Cue and layer management
│   ├── transition.ts         # Transition orchestration
│   ├── toriiListeners.ts     # Blockchain integration
│   └── testMaestro.ts        # Example usage
├── dist/                     # Compiled output (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add comprehensive type definitions
- Include JSDoc comments for public APIs
- Write tests for new functionality
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LucasArts iMUSE**: Inspiration for adaptive music technology
- **Dojo Engine**: Torii integration capabilities
- **React Community**: Hooks pattern and best practices

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/maestro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/maestro/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/maestro/wiki)

---

**Maestro** - Where music meets interactivity 🎵✨
