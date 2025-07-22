# Maestro API Documentation

This document provides comprehensive API documentation for the Maestro adaptive music system.

## Table of Contents

- [Core Types](#core-types)
- [React Hook](#react-hook)
- [Transport System](#transport-system)
- [Scheduler](#scheduler)
- [Transition Manager](#transition-manager)
- [Torii Integration](#torii-integration)
- [Utility Functions](#utility-functions)

## Core Types

### `Cue`

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

**Properties:**

- `id`: Unique string identifier for the cue
- `key`: MIDI pitch class (0-11, where 0=C, 1=C#/Db, 2=D, etc.)
- `tempo`: Tempo in beats per minute (BPM)
- `entryPoints`: Array of tick offsets where transitions can occur
- `layers`: Array of audio layers that make up the cue

**Example:**

```typescript
const cue: Cue = {
  id: "intro_theme",
  key: 0, // C major
  tempo: 120,
  entryPoints: [0, 1920], // Bar boundaries
  layers: [
    { id: "piano", channel: 0, volume: 100 },
    { id: "strings", channel: 1, volume: 80 },
  ],
};
```

### `CueLayer`

Defines an individual audio layer within a cue.

```typescript
interface CueLayer {
  id: string; // Layer identifier
  channel: number; // MIDI channel number
  volume: number; // Initial volume (0-127)
  muted?: boolean; // Optional mute state
}
```

**Properties:**

- `id`: Unique string identifier for the layer
- `channel`: MIDI channel number (0-15)
- `volume`: Initial volume level (0-127, where 127 is maximum)
- `muted`: Optional boolean to start the layer muted

**Example:**

```typescript
const layer: CueLayer = {
  id: "piano",
  channel: 0,
  volume: 100,
  muted: false,
};
```

### `Transport`

Manages musical timing and tempo.

```typescript
interface Transport {
  ppq: number; // Pulses per quarter note
  bpm: number; // Current tempo
  currentTick: number; // Current tick position
  currentBar: number; // Current bar number
  advance(ticks: number): void; // Advance timing
  setTempo(bpm: number): void; // Set new tempo
}
```

**Properties:**

- `ppq`: Pulses per quarter note (typically 480 for MIDI)
- `bpm`: Current tempo in beats per minute
- `currentTick`: Current tick position in the timeline
- `currentBar`: Current bar number (calculated from ticks)

**Methods:**

- `advance(ticks)`: Advance the transport by the specified number of ticks
- `setTempo(bpm)`: Set a new tempo

### `Scheduler`

Manages cue playback and layer states.

```typescript
interface Scheduler {
  scheduleCue(cue: Cue): void; // Schedule a cue for playback
  clear(): void; // Clear all scheduled cues
  fadeInLayer(channel: number, durationMs: number): void; // Fade in a layer
  fadeOutLayer(channel: number, durationMs: number): void; // Fade out a layer
}
```

**Methods:**

- `scheduleCue(cue)`: Schedule a cue for immediate playback
- `clear()`: Stop all current playback and clear the scheduler
- `fadeInLayer(channel, duration)`: Fade in a specific layer over the specified duration
- `fadeOutLayer(channel, duration)`: Fade out a specific layer over the specified duration

### `TransitionOptions`

Options for controlling transitions between cues.

```typescript
interface TransitionOptions {
  waitForBar?: boolean; // Wait for next bar boundary
  matchKey?: boolean; // Transpose to match current key
  matchTempo?: boolean; // Gradually adjust tempo
}
```

**Properties:**

- `waitForBar`: If true, wait for the next bar boundary before transitioning
- `matchKey`: If true, transpose the new cue to match the current key
- `matchTempo`: If true, gradually adjust tempo to match the new cue

## React Hook

### `useImuse(options?)`

Main React hook for managing adaptive music.

```typescript
function useImuse(options?: { withTorii?: boolean }): {
  playInitialCue: (cue: Cue) => void;
  transitionToCue: (cue: Cue, options: TransitionOptions) => void;
  fadeIn: (channel: number, duration: number) => void;
  fadeOut: (channel: number, duration: number) => void;
  currentCue: Cue | null;
  pendingCue: Cue | null;
};
```

**Parameters:**

- `options.withTorii`: Optional boolean to enable Torii blockchain integration

**Returns:**

- `playInitialCue`: Function to start playing a cue immediately
- `transitionToCue`: Function to transition to a new cue with options
- `fadeIn`: Function to fade in a specific layer
- `fadeOut`: Function to fade out a specific layer
- `currentCue`: Currently playing cue (null if none)
- `pendingCue`: Cue waiting to transition (null if none)

**Example:**

```typescript
import { useImuse } from "maestro";

function MyComponent() {
  const { playInitialCue, transitionToCue, currentCue } = useImuse();

  const handleStartMusic = () => {
    playInitialCue(introCue);
  };

  const handleCombatStart = () => {
    transitionToCue(combatCue, {
      waitForBar: true,
      matchKey: true,
      matchTempo: true,
    });
  };

  return (
    <div>
      <p>Current cue: {currentCue?.id}</p>
      <button onClick={handleStartMusic}>Start Music</button>
      <button onClick={handleCombatStart}>Start Combat</button>
    </div>
  );
}
```

## Transport System

### `createTransport(initialBpm, ppq?)`

Creates a new transport instance for managing musical timing.

```typescript
function createTransport(initialBpm: number, ppq?: number): Transport;
```

**Parameters:**

- `initialBpm`: Initial tempo in beats per minute
- `ppq`: Pulses per quarter note (default: 480)

**Returns:** A new Transport instance

**Example:**

```typescript
import { createTransport } from "maestro";

const transport = createTransport(120, 480);
console.log(transport.currentBar); // 0
transport.advance(1920); // Advance by 4 bars
console.log(transport.currentBar); // 4
```

## Scheduler

### `createScheduler()`

Creates a new scheduler instance for managing cue playback.

```typescript
function createScheduler(): Scheduler;
```

**Returns:** A new Scheduler instance

**Example:**

```typescript
import { createScheduler } from "maestro";

const scheduler = createScheduler();
scheduler.scheduleCue(myCue);
scheduler.fadeInLayer(0, 2000); // Fade in channel 0 over 2 seconds
```

## Transition Manager

### `createTransitionManager(transport, scheduler)`

Creates a new transition manager for orchestrating smooth transitions.

```typescript
function createTransitionManager(
  transport: Transport,
  scheduler: Scheduler
): TransitionManager;
```

**Parameters:**

- `transport`: Transport instance for timing
- `scheduler`: Scheduler instance for cue management

**Returns:** A new TransitionManager instance

**Example:**

```typescript
import { createTransitionManager } from "maestro";

const transport = createTransport(120);
const scheduler = createScheduler();
const transitionManager = createTransitionManager(transport, scheduler);

transitionManager.scheduleTransition({
  from: currentCue,
  to: newCue,
  options: { waitForBar: true, matchKey: true },
  onResolved: () => {
    console.log("Transition completed");
  },
});
```

## Torii Integration

### `useCombatSceneListener(enabled, onCueTrigger)`

Custom hook for listening to Torii blockchain events.

```typescript
function useCombatSceneListener(
  enabled: boolean,
  onCueTrigger: (cueId: string) => void
): void;
```

**Parameters:**

- `enabled`: Whether to enable Torii integration
- `onCueTrigger`: Callback function when a cue should be triggered

**Example:**

```typescript
import { useCombatSceneListener } from "maestro";

function GameComponent() {
  useCombatSceneListener(true, (cueId) => {
    console.log(`Combat scene detected, triggering cue: ${cueId}`);
    // Handle the cue trigger
  });

  return <div>Game content</div>;
}
```

## Utility Functions

### `createCueFromMidi(id, midi)`

Converts a parsed MIDI file into a Maestro cue object.

```typescript
function createCueFromMidi(id: string, midi: any): Cue;
```

**Parameters:**

- `id`: Unique identifier for the cue
- `midi`: Parsed MIDI file object

**Returns:** A Cue object created from the MIDI data

**Example:**

```typescript
import { createCueFromMidi } from "maestro";

const midiData = parseMidiFile(midiFile);
const cue = createCueFromMidi("my_cue", midiData);
```

## Error Handling

Maestro uses graceful error handling throughout the system:

- **Invalid Parameters**: Functions will log warnings and use defaults
- **Missing Dependencies**: Optional integrations (like Torii) fail gracefully
- **Audio Engine**: Placeholder implementations log TODO messages

## Performance Considerations

- **Timing Precision**: Uses 16ms intervals for smooth volume fading
- **Memory Management**: Clears intervals and references when components unmount
- **React Optimization**: Uses `useRef` and `useCallback` for performance
- **Modular Design**: Only loads Torii SDK when explicitly enabled

## Browser Compatibility

- **Modern Browsers**: Full support for ES6+ features
- **React**: Compatible with React 16.8+ (hooks support required)
- **TypeScript**: Requires TypeScript 4.5+ for full type support
- **Node.js**: Compatible with Node.js 16+ for server-side usage

## Integration Examples

### With Web Audio API

```typescript
// Example integration with Web Audio API
const audioContext = new AudioContext();
const scheduler = createScheduler();

// Hook into scheduler events
scheduler.scheduleCue = (cue) => {
  cue.layers.forEach((layer) => {
    // Create audio source for each layer
    const source = audioContext.createBufferSource();
    // ... audio setup
  });
};
```

### With MIDI.js

```typescript
// Example integration with MIDI.js
import MIDI from "midi.js";

const scheduler = createScheduler();

scheduler.scheduleCue = (cue) => {
  cue.layers.forEach((layer) => {
    MIDI.setVolume(layer.channel, layer.volume);
    // ... MIDI playback setup
  });
};
```

### With Tone.js

```typescript
// Example integration with Tone.js
import * as Tone from "tone";

const scheduler = createScheduler();

scheduler.scheduleCue = (cue) => {
  cue.layers.forEach((layer) => {
    const synth = new Tone.Synth().toDestination();
    // ... Tone.js setup
  });
};
```
