
// src/transport.ts
import { Transport } from "./types";

export function createTransport(initialBpm: number, ppq: number = 480): Transport {
  let bpm = initialBpm;
  let currentTick = 0;

  const tickDurationMs = () => (60000 / bpm) / ppq;

  const transport: Transport = {
    ppq,
    bpm,
    get currentTick() {
      return currentTick;
    },
    get currentBar() {
      return Math.floor(currentTick / (ppq * 4)); // assuming 4/4 time
    },
    advance(ticks: number) {
      currentTick += ticks;
    },
    setTempo(newBpm: number) {
      bpm = newBpm;
    }
  };

  // Optional: Add internal scheduler if needed
  // You could use requestAnimationFrame, setInterval, or a worker here

  return transport;
}
