# Maestro Examples

This document provides comprehensive examples of how to use Maestro for various adaptive music scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [React Integration](#react-integration)
- [Game Music](#game-music)
- [Interactive Media](#interactive-media)
- [Blockchain Gaming](#blockchain-gaming)
- [Advanced Patterns](#advanced-patterns)

## Basic Usage

### Simple Cue Management

```typescript
import {
  createTransport,
  createScheduler,
  createTransitionManager,
} from "maestro";

// Create core components
const transport = createTransport(120, 480);
const scheduler = createScheduler();
const transitionManager = createTransitionManager(transport, scheduler);

// Define musical cues
const introCue = {
  id: "intro_theme",
  key: 0, // C major
  tempo: 120,
  entryPoints: [0, 1920], // Bar boundaries
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

// Start playing
scheduler.scheduleCue(introCue);
console.log("🎵 Playing intro theme");

// Transition after 2 seconds
setTimeout(() => {
  transitionManager.scheduleTransition({
    from: introCue,
    to: combatCue,
    options: {
      waitForBar: true,
      matchKey: true,
      matchTempo: true,
    },
    onResolved: () => {
      scheduler.scheduleCue(combatCue);
      console.log("🎶 Transitioned to combat theme");
    },
  });
}, 2000);
```

### Volume Control

```typescript
import { createScheduler } from "maestro";

const scheduler = createScheduler();

// Schedule a cue with multiple layers
const cue = {
  id: "layered_theme",
  key: 0,
  tempo: 120,
  entryPoints: [0],
  layers: [
    { id: "melody", channel: 0, volume: 100 },
    { id: "harmony", channel: 1, volume: 80 },
    { id: "bass", channel: 2, volume: 90 },
  ],
};

scheduler.scheduleCue(cue);

// Fade out harmony layer
setTimeout(() => {
  scheduler.fadeOutLayer(1, 3000); // Fade out channel 1 over 3 seconds
}, 5000);

// Fade in melody layer
setTimeout(() => {
  scheduler.fadeInLayer(0, 2000); // Fade in channel 0 over 2 seconds
}, 8000);
```

## React Integration

### Basic React Component

```typescript
import React from "react";
import { useImuse } from "maestro";

function MusicPlayer() {
  const { playInitialCue, transitionToCue, currentCue, pendingCue } =
    useImuse();

  const introCue = {
    id: "intro",
    key: 0,
    tempo: 120,
    entryPoints: [0, 1920],
    layers: [{ id: "piano", channel: 0, volume: 100 }],
  };

  const actionCue = {
    id: "action",
    key: 2,
    tempo: 140,
    entryPoints: [0, 960],
    layers: [{ id: "brass", channel: 0, volume: 120 }],
  };

  return (
    <div>
      <h2>Music Player</h2>
      <p>Current: {currentCue?.id || "None"}</p>
      <p>Pending: {pendingCue?.id || "None"}</p>

      <button onClick={() => playInitialCue(introCue)}>Play Intro</button>

      <button
        onClick={() =>
          transitionToCue(actionCue, {
            waitForBar: true,
            matchKey: true,
            matchTempo: true,
          })
        }
      >
        Transition to Action
      </button>
    </div>
  );
}
```

### Interactive Music Controller

```typescript
import React, { useState } from "react";
import { useImuse } from "maestro";

function InteractiveMusicController() {
  const { playInitialCue, transitionToCue, fadeIn, fadeOut, currentCue } =
    useImuse();
  const [intensity, setIntensity] = useState(0);

  const cues = {
    calm: {
      id: "calm_ambient",
      key: 0,
      tempo: 80,
      entryPoints: [0, 1920],
      layers: [
        { id: "pads", channel: 0, volume: 60 },
        { id: "nature", channel: 1, volume: 40 },
      ],
    },
    tense: {
      id: "tense_buildup",
      key: 2,
      tempo: 100,
      entryPoints: [0, 960],
      layers: [
        { id: "strings", channel: 0, volume: 80 },
        { id: "drums", channel: 1, volume: 70 },
      ],
    },
    action: {
      id: "full_action",
      key: 4,
      tempo: 140,
      entryPoints: [0, 480],
      layers: [
        { id: "brass", channel: 0, volume: 120 },
        { id: "drums", channel: 1, volume: 110 },
        { id: "bass", channel: 2, volume: 100 },
      ],
    },
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);

    if (newIntensity < 0.3) {
      transitionToCue(cues.calm, { waitForBar: true, matchKey: true });
    } else if (newIntensity < 0.7) {
      transitionToCue(cues.tense, { waitForBar: true, matchKey: true });
    } else {
      transitionToCue(cues.action, { waitForBar: true, matchKey: true });
    }
  };

  return (
    <div>
      <h2>Interactive Music Controller</h2>
      <p>Current intensity: {Math.round(intensity * 100)}%</p>
      <p>Current cue: {currentCue?.id}</p>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={intensity}
        onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
      />

      <div>
        <button onClick={() => handleIntensityChange(0)}>Calm</button>
        <button onClick={() => handleIntensityChange(0.5)}>Tense</button>
        <button onClick={() => handleIntensityChange(1)}>Action</button>
      </div>
    </div>
  );
}
```

## Game Music

### RPG Music System

```typescript
import { useImuse } from "maestro";

function RPGGame() {
  const { playInitialCue, transitionToCue, fadeIn, fadeOut } = useImuse();

  const musicThemes = {
    overworld: {
      id: "overworld_theme",
      key: 0,
      tempo: 100,
      entryPoints: [0, 1920, 3840],
      layers: [
        { id: "melody", channel: 0, volume: 100 },
        { id: "harmony", channel: 1, volume: 80 },
        { id: "bass", channel: 2, volume: 90 },
      ],
    },
    town: {
      id: "town_theme",
      key: 2,
      tempo: 90,
      entryPoints: [0, 1440],
      layers: [
        { id: "woodwinds", channel: 0, volume: 90 },
        { id: "bells", channel: 1, volume: 70 },
      ],
    },
    dungeon: {
      id: "dungeon_theme",
      key: 5,
      tempo: 80,
      entryPoints: [0, 960],
      layers: [
        { id: "ambient", channel: 0, volume: 60 },
        { id: "drums", channel: 1, volume: 50 },
      ],
    },
    boss: {
      id: "boss_battle",
      key: 7,
      tempo: 160,
      entryPoints: [0, 480],
      layers: [
        { id: "brass", channel: 0, volume: 120 },
        { id: "drums", channel: 1, volume: 110 },
        { id: "choir", channel: 2, volume: 100 },
      ],
    },
  };

  const enterArea = (areaType: "overworld" | "town" | "dungeon" | "boss") => {
    const cue = musicThemes[areaType];
    transitionToCue(cue, {
      waitForBar: true,
      matchKey: true,
      matchTempo: true,
    });
  };

  const startCombat = () => {
    // Fade out current music
    fadeOut(0, 2000);
    fadeOut(1, 2000);
    fadeOut(2, 2000);

    // Start combat music after fade
    setTimeout(() => {
      transitionToCue(musicThemes.boss, {
        waitForBar: false, // Immediate transition for combat
        matchKey: true,
        matchTempo: true,
      });
    }, 2000);
  };

  return (
    <div>
      <h2>RPG Game</h2>
      <button onClick={() => enterArea("overworld")}>Enter Overworld</button>
      <button onClick={() => enterArea("town")}>Enter Town</button>
      <button onClick={() => enterArea("dungeon")}>Enter Dungeon</button>
      <button onClick={startCombat}>Start Boss Battle</button>
    </div>
  );
}
```

### Platformer Music

```typescript
import { useImuse } from "maestro";

function PlatformerGame() {
  const { playInitialCue, transitionToCue, fadeIn, fadeOut } = useImuse();

  const levelThemes = {
    level1: {
      id: "level_1_theme",
      key: 0,
      tempo: 120,
      entryPoints: [0, 960],
      layers: [
        { id: "melody", channel: 0, volume: 100 },
        { id: "bass", channel: 1, volume: 90 },
      ],
    },
    level2: {
      id: "level_2_theme",
      key: 2,
      tempo: 130,
      entryPoints: [0, 960],
      layers: [
        { id: "melody", channel: 0, volume: 100 },
        { id: "bass", channel: 1, volume: 90 },
        { id: "drums", channel: 2, volume: 80 },
      ],
    },
  };

  const powerUpMusic = {
    id: "power_up_jingle",
    key: 0,
    tempo: 120,
    entryPoints: [0],
    layers: [{ id: "jingle", channel: 3, volume: 100 }],
  };

  const startLevel = (level: number) => {
    const theme = level === 1 ? levelThemes.level1 : levelThemes.level2;
    playInitialCue(theme);
  };

  const collectPowerUp = () => {
    // Play power-up jingle on separate channel
    playInitialCue(powerUpMusic);

    // Return to level music after jingle
    setTimeout(() => {
      const currentLevel = 1; // Get from game state
      const theme =
        currentLevel === 1 ? levelThemes.level1 : levelThemes.level2;
      transitionToCue(theme, { waitForBar: true, matchKey: true });
    }, 2000);
  };

  return (
    <div>
      <h2>Platformer Game</h2>
      <button onClick={() => startLevel(1)}>Start Level 1</button>
      <button onClick={() => startLevel(2)}>Start Level 2</button>
      <button onClick={collectPowerUp}>Collect Power-Up</button>
    </div>
  );
}
```

## Interactive Media

### Educational Content

```typescript
import { useImuse } from "maestro";

function EducationalApp() {
  const { playInitialCue, transitionToCue } = useImuse();

  const backgroundMusic = {
    id: "background_ambient",
    key: 0,
    tempo: 80,
    entryPoints: [0, 1920],
    layers: [{ id: "ambient", channel: 0, volume: 40 }],
  };

  const successMusic = {
    id: "success_jingle",
    key: 0,
    tempo: 120,
    entryPoints: [0],
    layers: [{ id: "success", channel: 1, volume: 80 }],
  };

  const progressMusic = {
    id: "progress_theme",
    key: 2,
    tempo: 100,
    entryPoints: [0, 960],
    layers: [{ id: "progress", channel: 0, volume: 60 }],
  };

  const startLesson = () => {
    playInitialCue(backgroundMusic);
  };

  const completeExercise = () => {
    // Play success jingle
    playInitialCue(successMusic);

    // Return to background after jingle
    setTimeout(() => {
      transitionToCue(backgroundMusic, { waitForBar: true, matchKey: true });
    }, 1500);
  };

  const showProgress = () => {
    transitionToCue(progressMusic, { waitForBar: true, matchKey: true });
  };

  return (
    <div>
      <h2>Educational App</h2>
      <button onClick={startLesson}>Start Lesson</button>
      <button onClick={completeExercise}>Complete Exercise</button>
      <button onClick={showProgress}>Show Progress</button>
    </div>
  );
}
```

### Web Application Background Music

```typescript
import { useImuse } from "maestro";

function WebApp() {
  const { playInitialCue, transitionToCue, fadeIn, fadeOut } = useImuse();

  const themes = {
    default: {
      id: "default_theme",
      key: 0,
      tempo: 90,
      entryPoints: [0, 1920],
      layers: [{ id: "ambient", channel: 0, volume: 30 }],
    },
    focused: {
      id: "focused_theme",
      key: 2,
      tempo: 100,
      entryPoints: [0, 960],
      layers: [{ id: "focused", channel: 0, volume: 40 }],
    },
    creative: {
      id: "creative_theme",
      key: 4,
      tempo: 110,
      entryPoints: [0, 1440],
      layers: [{ id: "creative", channel: 0, volume: 35 }],
    },
  };

  const switchMode = (mode: "default" | "focused" | "creative") => {
    const theme = themes[mode];
    transitionToCue(theme, {
      waitForBar: true,
      matchKey: true,
      matchTempo: true,
    });
  };

  const toggleMusic = (enabled: boolean) => {
    if (enabled) {
      fadeIn(0, 2000);
    } else {
      fadeOut(0, 2000);
    }
  };

  return (
    <div>
      <h2>Web Application</h2>
      <button onClick={() => switchMode("default")}>Default Mode</button>
      <button onClick={() => switchMode("focused")}>Focused Mode</button>
      <button onClick={() => switchMode("creative")}>Creative Mode</button>
      <button onClick={() => toggleMusic(true)}>Fade In Music</button>
      <button onClick={() => toggleMusic(false)}>Fade Out Music</button>
    </div>
  );
}
```

## Blockchain Gaming

### Torii Integration Example

```typescript
import { useImuse } from "maestro";

function BlockchainGame() {
  const { playInitialCue, transitionToCue, currentCue } = useImuse({
    withTorii: true,
  });

  const gameThemes = {
    exploration: {
      id: "exploration_theme",
      key: 0,
      tempo: 100,
      entryPoints: [0, 1920],
      layers: [{ id: "ambient", channel: 0, volume: 80 }],
    },
    combat: {
      id: "combat_theme",
      key: 2,
      tempo: 140,
      entryPoints: [0, 960],
      layers: [{ id: "action", channel: 0, volume: 120 }],
    },
    victory: {
      id: "victory_theme",
      key: 0,
      tempo: 120,
      entryPoints: [0],
      layers: [{ id: "victory", channel: 0, volume: 100 }],
    },
  };

  // The useImuse hook with Torii enabled will automatically
  // listen for blockchain events and trigger appropriate music

  return (
    <div>
      <h2>Blockchain Game</h2>
      <p>Current cue: {currentCue?.id || "None"}</p>
      <p>Music will automatically adapt to blockchain events!</p>
    </div>
  );
}
```

## Advanced Patterns

### Dynamic Layer Management

```typescript
import { useImuse } from "maestro";

function AdvancedMusicController() {
  const { playInitialCue, transitionToCue, fadeIn, fadeOut } = useImuse();

  const baseCue = {
    id: "dynamic_theme",
    key: 0,
    tempo: 120,
    entryPoints: [0, 960],
    layers: [
      { id: "drums", channel: 0, volume: 100 },
      { id: "bass", channel: 1, volume: 90 },
      { id: "melody", channel: 2, volume: 80 },
      { id: "harmony", channel: 3, volume: 70 },
      { id: "effects", channel: 4, volume: 60 },
    ],
  };

  const addLayer = (channel: number) => {
    fadeIn(channel, 1000);
  };

  const removeLayer = (channel: number) => {
    fadeOut(channel, 1000);
  };

  const createDynamicCue = (activeLayers: number[]) => {
    return {
      ...baseCue,
      layers: baseCue.layers.map((layer, index) => ({
        ...layer,
        muted: !activeLayers.includes(index),
      })),
    };
  };

  return (
    <div>
      <h2>Advanced Music Controller</h2>
      <button onClick={() => playInitialCue(baseCue)}>Start Base Theme</button>
      <button onClick={() => addLayer(2)}>Add Melody</button>
      <button onClick={() => addLayer(3)}>Add Harmony</button>
      <button onClick={() => addLayer(4)}>Add Effects</button>
      <button onClick={() => removeLayer(2)}>Remove Melody</button>
      <button onClick={() => removeLayer(3)}>Remove Harmony</button>
      <button onClick={() => removeLayer(4)}>Remove Effects</button>
    </div>
  );
}
```

### Tempo-Based Transitions

```typescript
import { useImuse } from "maestro";

function TempoController() {
  const { playInitialCue, transitionToCue } = useImuse();

  const createTempoVariation = (baseCue: any, tempo: number) => ({
    ...baseCue,
    id: `${baseCue.id}_${tempo}`,
    tempo,
  });

  const baseTheme = {
    id: "base_theme",
    key: 0,
    tempo: 120,
    entryPoints: [0, 960],
    layers: [
      { id: "melody", channel: 0, volume: 100 },
      { id: "bass", channel: 1, volume: 90 },
    ],
  };

  const slowTheme = createTempoVariation(baseTheme, 80);
  const normalTheme = createTempoVariation(baseTheme, 120);
  const fastTheme = createTempoVariation(baseTheme, 160);

  const setTempo = (tempo: "slow" | "normal" | "fast") => {
    const theme =
      tempo === "slow" ? slowTheme : tempo === "fast" ? fastTheme : normalTheme;

    transitionToCue(theme, {
      waitForBar: true,
      matchKey: true,
      matchTempo: true,
    });
  };

  return (
    <div>
      <h2>Tempo Controller</h2>
      <button onClick={() => setTempo("slow")}>Slow Tempo</button>
      <button onClick={() => setTempo("normal")}>Normal Tempo</button>
      <button onClick={() => setTempo("fast")}>Fast Tempo</button>
    </div>
  );
}
```

### Key Modulation System

```typescript
import { useImuse } from "maestro";

function KeyModulationController() {
  const { playInitialCue, transitionToCue } = useImuse();

  const createKeyVariation = (baseCue: any, key: number) => ({
    ...baseCue,
    id: `${baseCue.id}_key_${key}`,
    key,
  });

  const baseTheme = {
    id: "base_theme",
    key: 0, // C major
    tempo: 120,
    entryPoints: [0, 960],
    layers: [{ id: "melody", channel: 0, volume: 100 }],
  };

  const keys = {
    c: createKeyVariation(baseTheme, 0), // C major
    d: createKeyVariation(baseTheme, 2), // D major
    e: createKeyVariation(baseTheme, 4), // E major
    f: createKeyVariation(baseTheme, 5), // F major
    g: createKeyVariation(baseTheme, 7), // G major
    a: createKeyVariation(baseTheme, 9), // A major
    b: createKeyVariation(baseTheme, 11), // B major
  };

  const modulateToKey = (keyName: keyof typeof keys) => {
    const theme = keys[keyName];
    transitionToCue(theme, {
      waitForBar: true,
      matchKey: false, // Don't match key, we want the modulation
      matchTempo: true,
    });
  };

  return (
    <div>
      <h2>Key Modulation Controller</h2>
      <button onClick={() => modulateToKey("c")}>C Major</button>
      <button onClick={() => modulateToKey("d")}>D Major</button>
      <button onClick={() => modulateToKey("e")}>E Major</button>
      <button onClick={() => modulateToKey("f")}>F Major</button>
      <button onClick={() => modulateToKey("g")}>G Major</button>
      <button onClick={() => modulateToKey("a")}>A Major</button>
      <button onClick={() => modulateToKey("b")}>B Major</button>
    </div>
  );
}
```

These examples demonstrate the flexibility and power of Maestro for creating adaptive music systems across various applications and use cases.
