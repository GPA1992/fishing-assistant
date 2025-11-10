import { smoothLerp } from "../../algorithms";

export const windScore = (w: number): number => {
  if (w <= 0) return 60; // calmaria total, ok mas não perfeito
  if (w <= 4) return smoothLerp(w, 0, 4, 90, 100); // subindo para brisa ideal
  if (w <= 8) return smoothLerp(w, 0, 8, 90, 100); // melhor faixa
  if (w <= 18) return smoothLerp(w, 8, 18, 90, 70); // 8–18 km/h: ainda bom
  if (w <= 28) return smoothLerp(w, 18, 28, 70, 40); // 18–28 km/h: vento forte, piorando
  if (w <= 40) return smoothLerp(w, 28, 40, 40, 20); // >28 km/h: ventania
  return 15; // extremo
};

const r = windScore(6.29);

console.log(r);
