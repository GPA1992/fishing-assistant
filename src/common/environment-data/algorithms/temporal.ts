import { clamp, smoothLerp } from "./math";

export function movingAverageCentered<T>(
  data: T[],
  index: number,
  windowSize: number,
  pick: (row: T) => number
): number {
  const n = data.length;
  if (n === 0) return NaN;

  const w = Math.max(1, windowSize | 0);
  const odd = w % 2 === 1 ? w : w + 1;
  const half = Math.floor(odd / 2);

  const start = Math.max(0, index - half);
  const end = Math.min(n - 1, index + half);

  let sum = 0;
  let cnt = 0;
  for (let k = start; k <= end; k++) {
    const v = pick(data[k]);
    if (Number.isFinite(v)) {
      sum += v;
      cnt++;
    }
  }
  return cnt ? sum / cnt : pick(data[index]);
}

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 24) * 60 + (m % 60);
}

export function windowProximity(
  nowMin: number,
  startMin: number,
  endMin: number,
  rampMin: number
): number {
  if (endMin < startMin) endMin += 24 * 60;
  let t = nowMin;
  if (t < startMin) t += 24 * 60;
  if (t > endMin) return 0;

  const enter = smoothLerp(t, startMin - rampMin, startMin, 0, 1);
  const exit = smoothLerp(t, endMin, endMin + rampMin, 1, 0);
  return clamp(Math.min(enter, exit), 0, 1);
}

export function minutesToEvent(
  nowMin: number,
  eventHHMM?: string
): number | undefined {
  if (!eventHHMM) return undefined;
  const e = hhmmToMinutes(eventHHMM);
  const diff = Math.min(
    Math.abs(nowMin - e),
    Math.abs(nowMin + 1440 - e),
    Math.abs(nowMin - (e + 1440))
  );
  return diff;
}
