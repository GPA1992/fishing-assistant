import { clamp, smoothLerp } from "../algorithms";

export const humidityScore = (h: number) => {
  if (h >= 90) return 20; // umidade muito alta: ruim
  if (h >= 80) return smoothLerp(h, 80, 90, 35, 20); // 80–90%: baixa
  if (h >= 70) return smoothLerp(h, 70, 80, 55, 35); // 70–80%: irregular
  if (h >= 60) return smoothLerp(h, 60, 70, 75, 55); // 60–70%: neutro tendendo a médio
  if (h >= 50) return smoothLerp(h, 50, 60, 95, 75); // 50–60%: início da zona boa
  if (h >= 40) return smoothLerp(h, 40, 50, 100, 95); // 40–50%: melhor faixa
  if (h >= 35) return smoothLerp(h, 35, 40, 90, 100); // 35–40%: ainda muito bom
  if (h >= 25) return smoothLerp(h, 25, 35, 75, 90); // 25–35%: muito seco, leve penalização
  return 60; // <25%: seco demais, penaliza mais
};

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

export function tempScoreTraira(tempC: number): number {
  let score: number;

  if (tempC < 8) {
    score = 0;
  } else if (tempC < 12) {
    // 8-12: sobe suave até 10
    score = smoothLerp(tempC, 8, 12, 0, 10);
  } else if (tempC < 15) {
    // 12-15: ruim, mas possível
    score = smoothLerp(tempC, 12, 15, 10, 25);
  } else if (tempC < 18) {
    // 15-18: transição fria
    score = smoothLerp(tempC, 15, 18, 25, 40);
  } else if (tempC < 22) {
    // 18-22: estável, melhorando
    score = smoothLerp(tempC, 18, 22, 40, 70);
  } else if (tempC < 26) {
    // 22-26: faixa ótima
    score = smoothLerp(tempC, 22, 26, 70, 100);
  } else if (tempC < 30) {
    // 26-30: ainda muito bom, leve queda
    score = smoothLerp(tempC, 26, 30, 100, 80);
  } else if (tempC < 33) {
    // 30-33: limiar de estresse
    score = smoothLerp(tempC, 30, 33, 80, 20);
  } else if (tempC < 36) {
    // 33-36: quase morto
    score = smoothLerp(tempC, 33, 36, 20, 0);
  } else {
    score = 0;
  }

  return Math.round(clamp(score, 0, 100));
}

export const windScore = (w: number): number => {
  if (w <= 0) return 60; // calmaria total, ok mas não perfeito
  if (w <= 4) return smoothLerp(w, 0, 4, 90, 100); // subindo para brisa ideal
  if (w <= 8) return smoothLerp(w, 0, 8, 90, 100); // melhor faixa
  if (w <= 18) return smoothLerp(w, 8, 18, 90, 70); // 8–18 km/h: ainda bom
  if (w <= 28) return smoothLerp(w, 18, 28, 70, 40); // 18–28 km/h: vento forte, piorando
  if (w <= 40) return smoothLerp(w, 28, 40, 40, 20); // >28 km/h: ventania
  return 15; // extremo
};
