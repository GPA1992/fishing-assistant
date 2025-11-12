const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
// suavização cúbica 0..1 -> 0..1
const smoothStep = (t: number) => t * t * (3 - 2 * t);

// interpolação suave entre y1 e y2 para x em [x1, x2]
const smoothLerp = (
  x: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number
): number => {
  if (x <= x1) return y1;
  if (x >= x2) return y2;
  const t = smoothStep((x - x1) / (x2 - x1));
  return y1 + (y2 - y1) * t;
};

function movingAverageCentered<T>(
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

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 24) * 60 + (m % 60);
}

function windowProximity(
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

function minutesToEvent(
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

export {
  clamp,
  clamp01,
  smoothStep,
  smoothLerp,
  movingAverageCentered,
  minutesToEvent,
  windowProximity,
  hhmmToMinutes,
};
