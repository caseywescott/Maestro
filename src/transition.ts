// src/transition.ts
import { Cue, Scheduler, Transport, TransitionManager, TransitionOptions } from "./types";

export function createTransitionManager(
  transport: Transport,
  scheduler: Scheduler
): TransitionManager {
  function scheduleTransition({
    from,
    to,
    options,
    onResolved,
  }: {
    from: Cue;
    to: Cue;
    options: TransitionOptions;
    onResolved: () => void;
  }) {
    const { waitForBar, matchKey, matchTempo } = options;

    // Calculate transposition (for future use)
    const transposeAmount = matchKey ? to.key - from.key : 0;
    const adjustedTempo = matchTempo ? from.tempo : to.tempo;

    // Wait until the next bar boundary, or use the next entry point
    const nowTick = transport.currentTick;
    const ppq = transport.ppq;
    const barLength = ppq * 4;

    const nextBarTick = Math.ceil(nowTick / barLength) * barLength;

    const delayTicks = waitForBar ? nextBarTick - nowTick : 0;

    console.log(`[transition] Scheduled from '${from.id}' to '${to.id}' in ${delayTicks} ticks`);

    setTimeout(() => {
      // Apply tempo match
      transport.setTempo(adjustedTempo);

      // TODO: If needed, apply pitch transposition at scheduler/synth level
      // Currently, we assume cue/layer data are pre-transposed or handled upstream

      onResolved();
    }, ticksToMs(delayTicks, transport.bpm, ppq));
  }

  return {
    scheduleTransition,
  };
}

function ticksToMs(ticks: number, bpm: number, ppq: number): number {
  const msPerBeat = 60000 / bpm;
  return (ticks / ppq) * msPerBeat;
}
