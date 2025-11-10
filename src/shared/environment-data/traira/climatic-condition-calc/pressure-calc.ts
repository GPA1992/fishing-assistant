import { smoothLerp } from "../../algorithms";
export const pressureScore = (p: number): number => {
  // >1020 hPa: alta estável, ruim
  if (p >= 1030) return 20;
  if (p >= 1020) return smoothLerp(p, 1020, 1030, 40, 20);

  // 1010–1020 hPa: faixa ótima
  if (p >= 1010) return smoothLerp(p, 1010, 1020, 90, 100);

  // 1005–1010 hPa: levemente baixa, bom
  if (p >= 1005) return smoothLerp(p, 1005, 1010, 75, 90);

  // 995–1005 hPa: baixa moderada, ok
  if (p >= 995) return smoothLerp(p, 995, 1005, 60, 75);

  // 980–995 hPa: baixa forte, cenário extremo sem trend -> levemente abaixo do neutro
  if (p >= 980) return smoothLerp(p, 980, 995, 50, 60);

  // <980 hPa: muito baixa, sem trend assume risco/instabilidade
  return 45;
};

const r = pressureScore(961.26);
console.log(r);
