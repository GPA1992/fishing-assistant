import { smoothLerp } from "../../algorithms";

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
const result = humidityScore(77);
console.log(result);
