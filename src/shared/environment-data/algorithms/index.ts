const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

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

export { clamp, smoothStep, smoothLerp };
