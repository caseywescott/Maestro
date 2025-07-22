// src/scheduler.ts
import { Cue, Scheduler } from "./types";

type LayerState = {
  volume: number;
  targetVolume: number;
  fading: boolean;
};

const LAYER_FADE_INTERVAL = 16; // ms for smoother ramps

export function createScheduler(): Scheduler {
  const layerStates: Record<number, LayerState> = {};

  function scheduleCue(cue: Cue) {
    cue.layers.forEach(layer => {
      layerStates[layer.channel] = {
        volume: layer.muted ? 0 : layer.volume,
        targetVolume: layer.volume,
        fading: false,
      };

      // Trigger actual playback start here
      // TODO: Integrate with a MIDI engine or audio context
      console.log(`[scheduler] Starting cue: ${cue.id} on channel ${layer.channel}`);
    });
  }

  function clear() {
    Object.keys(layerStates).forEach(channel => {
      delete layerStates[Number(channel)];
    });
  }

  function fadeLayerVolume(channel: number, target: number, durationMs: number) {
    const state = layerStates[channel];
    if (!state) return;

    state.targetVolume = target;
    state.fading = true;

    const startVolume = state.volume;
    const steps = Math.ceil(durationMs / LAYER_FADE_INTERVAL);
    const delta = (target - startVolume) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (!layerStates[channel]) return clearInterval(interval);

      currentStep++;
      state.volume = startVolume + delta * currentStep;

      // Clamp volume
      state.volume = Math.max(0, Math.min(127, state.volume));

      // TODO: Hook here to send updated volume to the synth/MIDI engine
      console.log(`[fade] Channel ${channel} volume: ${state.volume}`);

      if (currentStep >= steps) {
        state.volume = target;
        state.fading = false;
        clearInterval(interval);
      }
    }, LAYER_FADE_INTERVAL);
  }

  return {
    scheduleCue,
    clear,
    fadeInLayer(channel: number, duration: number) {
      fadeLayerVolume(channel, 127, duration);
    },
    fadeOutLayer(channel: number, duration: number) {
      fadeLayerVolume(channel, 0, duration);
    },
  };
}
