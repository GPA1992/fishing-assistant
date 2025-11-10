import { clamp, smoothLerp } from "../algorithms";

/**
 * Nota de temperatura para traíra (0-100)
 *
 * Faixas alvo (derivadas da descrição):
 * <12   -> ~0 (peixe travado)
 * 12-15 -> 10-25 (ruim, só reage encostado)
 * 15-18 -> 25-40 (baixa, alguma janela em rasos)
 * 18-22 -> 40-70 (melhorando, ainda pedindo isca lenta)
 * 22-26 -> 70-100 (ótimo geral)
 * 26-30 -> 100-80 (ainda muito bom, cai no pico do dia)
 * 30-33 -> 80-20 (estresse, janelas curtas)
 * >33   -> 20-0 (quase inviável)
 */
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
