import { clamp, smoothLerp } from "../algorithms";

export const pressureScore = (p: number, delta: number) => {
  const base = basePressureScore(p);
  const trend = pressureTrendScore(delta);
  return clamp(0.4 * base + 0.6 * trend, 0, 100);
};

const basePressureScore = (p: number): number => {
  if (p >= 1030) return 20; // alta muito forte
  if (p >= 1020) return smoothLerp(p, 1020, 1030, 40, 20); // alta estável: ruim
  if (p >= 1010) return 85; // 1010–1020: faixa ótima
  if (p >= 1005) return smoothLerp(p, 1005, 1010, 70, 85); // levemente baixa: boa
  if (p >= 995) return smoothLerp(p, 995, 1005, 60, 70); // baixa moderada
  return 55; // <995: baixa profunda, neutro (trend decide)
};

const pressureTrendScore = (delta: number): number => {
  if (delta <= -4) return 100; // queda acentuada
  if (delta <= -2) return smoothLerp(delta, -4, -2, 100, 90); // queda forte
  if (delta <= -1) return smoothLerp(delta, -2, -1, 90, 80); // queda gradual
  if (delta < 1) return 60; // estável
  if (delta < 3) return smoothLerp(delta, 1, 3, 40, 25); // subindo
  return 15; // subida acentuada
};
