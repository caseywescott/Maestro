import { createTransport } from "./transport";
import { createScheduler } from "./scheduler";
import { createTransitionManager } from "./transition";
import { Cue } from "./types";

// Create base components
const transport = createTransport(120, 480);
const scheduler = createScheduler();
const transitionManager = createTransitionManager(transport, scheduler);

// Create sample cue
const cueA: Cue = {
  id: "intro_theme",
  key: 0,
  tempo: 120,
  entryPoints: [0, 1920],
  layers: [
    { id: "piano", channel: 0, volume: 100 },
    { id: "strings", channel: 1, volume: 80 },
  ],
};

const cueB: Cue = {
  id: "combat_theme",
  key: 2,
  tempo: 100,
  entryPoints: [0, 960],
  layers: [
    { id: "brass", channel: 0, volume: 120 },
    { id: "drums", channel: 1, volume: 110 },
  ],
};

// Simulate usage
scheduler.scheduleCue(cueA);
console.log("🎵 Playing cueA");

setTimeout(() => {
  transitionManager.scheduleTransition({
    from: cueA,
    to: cueB,
    options: { waitForBar: true, matchKey: true, matchTempo: true },
    onResolved: () => {
      scheduler.scheduleCue(cueB);
      transport.setTempo(cueB.tempo);
      console.log("🎶 Transitioned to cueB");
    },
  });
}, 2000); // simulate player decision/change after 2s
