import { clamp, smoothLerp } from "../algorithms";

/**
 * phase em [0,1]:
 * 0.00  -> Lua Nova
 * 0-0.25    -> Crescente Côncava
 * 0.25      -> Quarto Crescente
 * 0.25-0.5  -> Crescente Gibosa
 * 0.5       -> Lua Cheia
 * 0.5-0.75  -> Minguante Gibosa
 * 0.75      -> Quarto Minguante
 * 0.75-1    -> Minguante Côncava
 *
 * Critério:
 * - Lua Nova e Lua Cheia: topo (100).
 * - Quartos (0.25 / 0.75): mínimo relativo (75).
 * - Intervalos entre eles interpolam suavemente.
 */
export function moonPhaseScore(phase: number): number {
  if (!Number.isFinite(phase)) return 50;

  // normaliza para [0,1]
  const v = ((phase % 1) + 1) % 1;

  let score: number;

  if (v === 0) {
    score = 100; // Lua Nova
  } else if (v > 0 && v < 0.25) {
    // Crescente Côncava: cai de 100 (próximo da Nova) até 75 (Quarto)
    score = smoothLerp(v, 0, 0.25, 100, 75);
  } else if (v === 0.25) {
    score = 75; // Quarto Crescente
  } else if (v > 0.25 && v < 0.5) {
    // Crescente Gibosa: sobe de 75 até 100 (Cheia)
    score = smoothLerp(v, 0.25, 0.5, 75, 100);
  } else if (v === 0.5) {
    score = 100; // Lua Cheia
  } else if (v > 0.5 && v < 0.75) {
    // Minguante Gibosa: desce de 100 até 75 (Quarto Minguante)
    score = smoothLerp(v, 0.5, 0.75, 100, 75);
  } else if (v === 0.75) {
    score = 75; // Quarto Minguante
  } else {
    // Minguante Côncava (0.75-1): sobe de 75 de volta para 100 (Nova)
    score = smoothLerp(v, 0.75, 1, 75, 100);
  }

  return Math.round(clamp(score, 0, 100));
}
