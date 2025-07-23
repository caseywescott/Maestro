# Maestro README Section for Maestro-Player

Copy this section to your Maestro repository's README.md file to reference the Maestro-Player examples.

---

## 🎵 Examples

### Interactive Music React Example

A comprehensive example demonstrating Maestro's capabilities with React, including smart transitions, layer management, and real-time MIDI control.

**[View Example](https://github.com/caseywescott/Maestro-Player)**

#### Features Demonstrated

- **🎵 Smart Transitions**: Intelligent musical transitions with context awareness
- **🎛️ Layer Management**: Real-time audio layer control and fade effects
- **📊 MIDI Analysis**: Comprehensive MIDI file analysis and visualization
- **🎼 Live Controls**: Tempo, transpose, reverb, and instrument switching
- **🧠 Adaptive Music**: Dynamic layer adjustments based on user actions

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/caseywescott/Maestro-Player.git
cd Maestro-Player

# Install dependencies
npm install

# Start the development server
npm start
```

In another terminal:

```bash
cd public
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

#### What You'll Learn

- How to integrate Maestro with React using custom hooks
- Creating and managing musical cues from MIDI files
- Implementing smart transitions with context awareness
- Real-time audio layer management and control
- Building interactive music interfaces with TypeScript

#### Key Maestro Concepts

```typescript
// Cue creation from MIDI files
import { createCueFromMidi } from "maestro/dist/useImuse"
const cue = createCueFromMidi("my-cue", midiFile)

// Smart transitions with options
iMuse.transitionToCue(targetCue, {
  waitForBar: true,
  matchKey: true,
  matchTempo: true,
  fadeInDuration: 500,
  fadeOutDuration: 500,
})

// Layer management
iMuse.fadeInLayer(channel, 1000) // 1 second fade
iMuse.fadeOutLayer(channel, 500) // 0.5 second fade

// Transport control
iMuse.play()
iMuse.pause()
iMuse.seek(0.5) // Seek to 50%
```

---

## 🚀 Getting Started

### Basic Usage

```typescript
import { createCueFromMidi } from "maestro/dist/useImuse"
import { createScheduler } from "maestro/dist/scheduler"
import { createTransitionManager } from "maestro/dist/transition"

// Create a cue from a MIDI file
const cue = createCueFromMidi("my-cue", midiFile)

// Set up scheduling and transitions
const scheduler = createScheduler()
const transitionManager = createTransitionManager()

// Start playback
scheduler.play(cue)
```

### React Integration

For React applications, check out our **[Maestro Player Example](https://github.com/caseywescott/Maestro-Player)** which demonstrates:

- Custom React hooks for Maestro integration
- Smart transition management
- Real-time audio controls
- MIDI analysis and visualization

---

## 📚 Documentation

- **[API Reference](./docs/api.md)** - Complete API documentation
- **[Examples](https://github.com/caseywescott/Maestro-Player)** - Interactive music example
- **[Interactive Music Example](https://github.com/caseywescott/Maestro-Player)** - Comprehensive React integration example

---

## 🔗 Links

- **[Maestro Player](https://github.com/caseywescott/Maestro-Player)** - Interactive music example
- **[Live Demo](https://caseywescott.github.io/Maestro-Player/)** - Live demo of the example (when deployed)
- **[Issues](https://github.com/caseywescott/Maestro/issues)** - Report bugs or request features
- **[Discussions](https://github.com/caseywescott/Maestro/discussions)** - Community discussions and questions

---
