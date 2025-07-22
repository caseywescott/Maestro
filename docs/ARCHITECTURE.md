# Maestro Architecture

This document provides a detailed overview of Maestro's architecture, design patterns, and technical implementation.

## Table of Contents

- [Overview](#overview)
- [Core Architecture](#core-architecture)
- [Component Design](#component-design)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Considerations](#performance-considerations)
- [Extensibility](#extensibility)

## Overview

Maestro is built with a modular, event-driven architecture that separates concerns and promotes reusability. The system is designed to be:

- **Modular**: Each component has a single responsibility
- **Extensible**: Easy to add new features and integrations
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Performance-Oriented**: Optimized for real-time audio applications
- **Framework-Agnostic**: Core logic is independent of React

## Core Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Hook    │    │   Core Engine   │    │  Audio Engine   │
│   (useImuse)    │◄──►│   (Transport,   │◄──►│  (Web Audio,    │
│                 │    │   Scheduler,    │    │   MIDI, etc.)   │
│                 │    │   Transition)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Torii Hook    │    │   State Mgmt    │    │   Event System  │
│ (Blockchain)    │    │   (LayerState)  │    │   (Timing)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Relationships

```
useImuse Hook
├── Transport (Timing)
├── Scheduler (Cue Management)
├── TransitionManager (Transitions)
└── ToriiListener (Blockchain)

Transport
├── Tick-based timing
├── Bar calculations
└── Tempo management

Scheduler
├── Layer state management
├── Volume fading
└── Cue scheduling

TransitionManager
├── Bar synchronization
├── Key matching
└── Tempo matching
```

## Component Design

### 1. Transport System

**Purpose**: Manages musical timing and tempo

**Key Features**:
- Tick-based timing system (typically 480 PPQ)
- Bar boundary calculations
- Tempo management
- Time conversion utilities

**Implementation**:
```typescript
interface Transport {
  ppq: number;                   // Pulses per quarter note
  bpm: number;                   // Current tempo
  currentTick: number;           // Current position
  currentBar: number;            // Current bar
  advance(ticks: number): void;  // Advance timing
  setTempo(bpm: number): void;   // Set tempo
}
```

**Design Decisions**:
- Uses ticks for precise timing (standard in MIDI)
- Calculates bars from ticks for musical synchronization
- Immutable tempo changes for consistency

### 2. Scheduler System

**Purpose**: Manages cue playback and layer states

**Key Features**:
- Layer state tracking
- Volume fading with smooth ramps
- Cue scheduling and clearing
- Channel management

**Implementation**:
```typescript
interface Scheduler {
  scheduleCue(cue: Cue): void;
  clear(): void;
  fadeInLayer(channel: number, durationMs: number): void;
  fadeOutLayer(channel: number, durationMs: number): void;
}
```

**Design Decisions**:
- 16ms intervals for smooth volume ramps (60fps)
- Channel-based layer management
- State persistence for layer volumes
- Graceful cleanup of intervals

### 3. Transition Manager

**Purpose**: Orchestrates smooth transitions between cues

**Key Features**:
- Bar-synchronized transitions
- Key and tempo matching
- Entry point selection
- Transition timing

**Implementation**:
```typescript
interface TransitionManager {
  scheduleTransition(params: {
    from: Cue;
    to: Cue;
    options: TransitionOptions;
    onResolved: () => void;
  }): void;
}
```

**Design Decisions**:
- Bar synchronization for musical coherence
- Configurable transition options
- Callback-based completion handling
- Time-based scheduling

### 4. React Integration

**Purpose**: Provides React hooks for easy integration

**Key Features**:
- `useImuse` hook for main functionality
- State management with React hooks
- Torii integration option
- Performance optimizations

**Implementation**:
```typescript
function useImuse(options?: { withTorii?: boolean }): {
  playInitialCue: (cue: Cue) => void;
  transitionToCue: (cue: Cue, options: TransitionOptions) => void;
  fadeIn: (channel: number, duration: number) => void;
  fadeOut: (channel: number, duration: number) => void;
  currentCue: Cue | null;
  pendingCue: Cue | null;
}
```

**Design Decisions**:
- Uses `useRef` for stable references
- Uses `useCallback` for performance
- Optional Torii integration
- State synchronization

## Data Flow

### 1. Cue Playback Flow

```
User Action → React Hook → Scheduler → Audio Engine
     ↓              ↓           ↓           ↓
  playCue() → scheduleCue() → LayerState → Sound Output
```

### 2. Transition Flow

```
User Action → React Hook → TransitionManager → Scheduler → Audio Engine
     ↓              ↓              ↓              ↓           ↓
transitionTo() → scheduleTransition() → waitForBar() → scheduleCue() → Sound
```

### 3. Volume Control Flow

```
User Action → React Hook → Scheduler → Volume Ramp → Audio Engine
     ↓              ↓           ↓           ↓           ↓
  fadeIn() → fadeInLayer() → setInterval() → updateVolume() → Sound
```

### 4. Torii Integration Flow

```
Blockchain Event → Torii Listener → React Hook → TransitionManager → Audio
      ↓                ↓              ↓              ↓              ↓
   onData() → onCueTrigger() → transitionToCue() → scheduleTransition() → Sound
```

## Design Patterns

### 1. Factory Pattern

Used for creating instances of core components:

```typescript
// Transport factory
function createTransport(initialBpm: number, ppq?: number): Transport

// Scheduler factory
function createScheduler(): Scheduler

// Transition manager factory
function createTransitionManager(transport: Transport, scheduler: Scheduler): TransitionManager
```

### 2. Observer Pattern

Used for event handling and state changes:

```typescript
// Transition completion callback
onResolved: () => void

// Torii event listener
onCueTrigger: (cueId: string) => void
```

### 3. State Management Pattern

Used for managing layer states and cue information:

```typescript
type LayerState = {
  volume: number;
  targetVolume: number;
  fading: boolean;
};
```

### 4. Strategy Pattern

Used for different transition strategies:

```typescript
interface TransitionOptions {
  waitForBar?: boolean;
  matchKey?: boolean;
  matchTempo?: boolean;
}
```

## Performance Considerations

### 1. Timing Precision

- **16ms Intervals**: Used for volume fading (60fps equivalent)
- **Tick-based Timing**: Precise musical timing
- **RequestAnimationFrame**: For smooth visual updates

### 2. Memory Management

- **Interval Cleanup**: Automatic cleanup of setInterval calls
- **Reference Stability**: Uses useRef for stable references
- **State Cleanup**: Proper cleanup in React useEffect

### 3. React Optimization

- **useCallback**: Prevents unnecessary re-renders
- **useRef**: Stable references for core components
- **Conditional Rendering**: Only loads Torii when needed

### 4. Audio Performance

- **Layer Management**: Efficient channel allocation
- **Volume Ramps**: Smooth transitions without audio artifacts
- **Bar Synchronization**: Musical timing for seamless transitions

## Extensibility

### 1. Audio Engine Integration

The scheduler provides hooks for audio engine integration:

```typescript
// TODO: Integrate with a MIDI engine or audio context
console.log(`[scheduler] Starting cue: ${cue.id} on channel ${layer.channel}`);
```

### 2. Custom Transition Types

The transition manager can be extended with new transition strategies:

```typescript
interface CustomTransitionOptions extends TransitionOptions {
  crossfade?: boolean;
  pitchShift?: number;
  filterSweep?: boolean;
}
```

### 3. Additional Blockchain Integrations

The Torii integration can be extended for other blockchain platforms:

```typescript
interface BlockchainListener {
  platform: 'torii' | 'ethereum' | 'solana';
  events: string[];
  onEvent: (event: any) => void;
}
```

### 4. MIDI Integration

Built-in support for MIDI file conversion:

```typescript
export function createCueFromMidi(id: string, midi: any): Cue
```

## Future Architecture Considerations

### 1. Web Workers

For performance-critical operations:

```typescript
// Potential future implementation
const audioWorker = new Worker('audio-worker.js');
audioWorker.postMessage({ type: 'scheduleCue', cue });
```

### 2. Web Audio API Integration

Direct integration with Web Audio API:

```typescript
// Potential future implementation
const audioContext = new AudioContext();
const scheduler = createScheduler(audioContext);
```

### 3. Network Synchronization

For multi-player scenarios:

```typescript
// Potential future implementation
interface NetworkSync {
  syncCue(cue: Cue, timestamp: number): void;
  onCueSync(callback: (cue: Cue) => void): void;
}
```

### 4. Machine Learning Integration

For AI-driven music adaptation:

```typescript
// Potential future implementation
interface MLAdapter {
  analyzeContext(context: GameContext): CueRecommendation;
  adaptCue(cue: Cue, context: GameContext): Cue;
}
```

This architecture provides a solid foundation for adaptive music systems while maintaining flexibility for future enhancements and integrations. 