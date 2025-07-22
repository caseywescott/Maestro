import { useEffect, useRef, useState, useCallback } from "react";
import { Cue } from "./types";
import { createTransport } from "./transport";
import { createScheduler } from "./scheduler";
import { createTransitionManager } from "./transition";
import { useCombatSceneListener } from "./toriiListeners";

export function useImuse({ withTorii = false }: { withTorii?: boolean } = {}) {
  const [currentCue, setCurrentCue] = useState<Cue | null>(null);
  const [pendingCue, setPendingCue] = useState<Cue | null>(null);
  const transport = useRef(createTransport(120, 480)).current;
  const scheduler = useRef(createScheduler()).current;
  const transitionManager = useRef(createTransitionManager(transport, scheduler)).current;

  const playInitialCue = useCallback((cue: Cue) => {
    scheduler.clear();
    scheduler.scheduleCue(cue);
    transport.setTempo(cue.tempo);
    setCurrentCue(cue);
  }, [scheduler, transport]);

  const transitionToCue = useCallback(
    (cue: Cue, options: { waitForBar?: boolean; matchKey?: boolean; matchTempo?: boolean }) => {
      setPendingCue(cue);
      transitionManager.scheduleTransition({
        from: currentCue!,
        to: cue,
        options,
        onResolved: () => {
          scheduler.scheduleCue(cue);
          transport.setTempo(cue.tempo);
          setCurrentCue(cue);
          setPendingCue(null);
        },
      });
    },
    [currentCue, transitionManager, scheduler, transport]
  );

  const fadeIn = (channel: number, duration: number) => {
    scheduler.fadeInLayer(channel, duration);
  };

  const fadeOut = (channel: number, duration: number) => {
    scheduler.fadeOutLayer(channel, duration);
  };

  // Modular Torii integration
  useCombatSceneListener(withTorii, (cueId: string) => {
    const cue = getCueById(cueId);
    transitionToCue(cue, { waitForBar: true, matchKey: true, matchTempo: true });
  });

  return {
    playInitialCue,
    transitionToCue,
    fadeIn,
    fadeOut,
    currentCue,
    pendingCue,
  };
}

function getCueById(id: string): Cue {
  return {
    id,
    key: 0,
    tempo: 120,
    entryPoints: [0],
    layers: [],
  };
}

// Optional helper to turn a parsed MIDI file into a Cue object
export function createCueFromMidi(id: string, midi: any): Cue {
    return {
      id,
      key: 0, // Can be analyzed from MIDI if needed
      tempo: midi.header?.tempos?.[0]?.bpm ?? 120,
      entryPoints: [0], // This can be extended later
      layers: midi.tracks.map((track: any, index: number) => ({
        id: `track-${index}`,
        channel: index,
        volume: 100,
        muted: false,
      })),
    };
  }
  