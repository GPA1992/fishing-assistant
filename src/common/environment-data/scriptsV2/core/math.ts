export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const clamp01 = (value: number) => clamp(value, 0, 1);

export const smoothStep = (t: number) => t * t * (3 - 2 * t);

export const smoothLerp = (
  x: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  curve: "smooth" | "linear" | "step" = "smooth"
): number => {
  if (x1 === x2) return y2;
  if (curve === "step") return x < x2 ? y1 : y2;

  const tRaw = clamp((x - x1) / (x2 - x1), 0, 1);
  const t = curve === "linear" ? tRaw : smoothStep(tRaw);
  return y1 + (y2 - y1) * t;
};
