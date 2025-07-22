// src/types.ts

export interface Cue {
    id: string;
    key: number; // MIDI pitch class (e.g., 0 = C, 1 = C#/Db, etc.)
    tempo: number; // BPM
    entryPoints: number[]; // bar or tick offsets to allow musical transitions
    layers: CueLayer[]; // instrumentation or MIDI channel groupings
  }
  
  export interface CueLayer {
    id: string;
    channel: number;
    volume: number; // initial volume (0–127)
    muted?: boolean;
  }
  
  export interface Transport {
    ppq: number;
    bpm: number;
    currentTick: number;
    currentBar: number;
    advance(ticks: number): void;
    setTempo(bpm: number): void;
  }
  
  export interface Scheduler {
    scheduleCue(cue: Cue): void;
    clear(): void;
    fadeInLayer(channel: number, durationMs: number): void;
    fadeOutLayer(channel: number, durationMs: number): void;
  }
  
  export interface TransitionOptions {
    waitForBar?: boolean;
    matchKey?: boolean;
    matchTempo?: boolean;
  }
  
  export interface TransitionManager {
    scheduleTransition(params: {
      from: Cue;
      to: Cue;
      options: TransitionOptions;
      onResolved: () => void;
    }): void;
  }
  