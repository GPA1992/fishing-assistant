import { clamp, smoothLerp } from "../../algorithms";

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

// clima/pressure.ts
export function pressureScore(p: number, dp6h?: number): number {
  // base pelo valor absoluto
  let base: number;
  if (p >= 1030) base = 60;
  else if (p >= 1022) base = smoothLerp(p, 1022, 1030, 85, 60);
  else if (p >= 1016) base = smoothLerp(p, 1016, 1022, 100, 85);
  else if (p >= 1010) base = smoothLerp(p, 1010, 1016, 90, 100);
  else if (p >= 1005) base = smoothLerp(p, 1005, 1010, 75, 90);
  else if (p >= 995) base = smoothLerp(p, 995, 1005, 60, 75);
  else if (p >= 980) base = smoothLerp(p, 980, 995, 50, 60);
  else base = 45;

  // ajuste por tendência nas últimas ~6h (hPa)
  if (typeof dp6h === "number") {
    // queda negativa é bônus, alta positiva é penalidade
    const fall = clamp(-dp6h, 0, 6); // até −6 hPa/6h
    const rise = clamp(dp6h, 0, 6); // até +6 hPa/6h
    const bonus = smoothLerp(fall, 0, 6, 0, 6);
    const malus = smoothLerp(rise, 0, 6, 0, 12);
    base = clamp(base + bonus - malus, 0, 100);
  }

  return Math.round(base);
}

export const temperatureScore = (tempC: number): number => {
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
};

// clima/wind.ts
export const windScore = (w: number): number => {
  if (w <= 0) return 55;
  if (w <= 3) return smoothLerp(w, 0, 3, 85, 95); // pico em ~2–3 km/h
  if (w <= 8) return smoothLerp(w, 3, 8, 95, 80); // começa a dispersar estímulos
  if (w <= 18) return smoothLerp(w, 8, 18, 80, 60);
  if (w <= 28) return smoothLerp(w, 18, 28, 60, 35);
  if (w <= 40) return smoothLerp(w, 28, 40, 35, 20);
  return 15;
};
