import { clamp, smoothLerp } from "../algorithms";

type TrairaRainContext = {
  volumeMmPerHour: number; // volume total de precipitação (mm/h)
  rainProbability: number; // probabilidade de chuva (0-100)
  showerVolumeMmPerHour: number; // volume de pancadas (mm/h)
  temperatureC: number; // temperatura (°C)
  humidityPct: number; // umidade relativa (%)
  pressure: number; // pressão (unidade consistente)
  windSpeed: number; // velocidade do vento (unidade consistente)
};

export function rainScoreTraira(context: TrairaRainContext): number {
  const volume = Math.max(0, context.volumeMmPerHour);
  const probability = clamp(context.rainProbability, 0, 100);
  const showerVolume = Math.max(0, context.showerVolumeMmPerHour);
  const temperature = context.temperatureC;
  const humidity = clamp(context.humidityPct, 0, 100);
  const windSpeed = Math.max(0, context.windSpeed);

  // Faixa térmica considerada ideal para atividade da traíra
  const isWarmRange = temperature >= 24 && temperature <= 32;

  // Faixa de calor acima do ideal
  const isHotRange = temperature > 32;

  // Faixa fria que tende a reduzir atividade
  const isColdRange = temperature < 20;

  // Dia quente, seco, estável e com baixa chance de chuva
  const isSunnyWarmStable =
    volume === 0 && probability < 40 && isWarmRange && humidity <= 75;

  // Cenário frio, úmido e com chuva presente ou muito provável
  const isColdRainScenario =
    isColdRange && (volume > 0 || probability > 60) && humidity >= 80;

  // Cenário de temporal: muita chuva ou alta chance com vento forte
  const isStormScenario = volume >= 8 || (probability >= 70 && windSpeed >= 25);

  // Chuva leve dentro da faixa aceitável
  const isLightRain = volume > 0 && volume <= 2;

  // Chuva moderada, começando a atrapalhar
  const isModerateRain = volume > 2 && volume <= 5;

  // Pancada identificada por volume dedicado a shower em intensidade controlada
  const isShowerScenario = showerVolume > 0 && volume <= 5;

  let rainScore = 0;

  // 1) Base pelo volume/probabilidade

  if (volume === 0 && probability < 30) {
    rainScore = 60;
  }

  if (volume === 0 && probability >= 30 && probability < 70) {
    rainScore = smoothLerp(probability, 30, 70, 65, 80);
  }

  if (volume === 0 && probability >= 70) {
    rainScore = smoothLerp(probability, 70, 100, 80, 90);
  }

  if (volume > 0 && isLightRain) {
    rainScore = smoothLerp(volume, 0, 2, 70, 80);
  }

  if (volume > 0 && isModerateRain) {
    rainScore = smoothLerp(volume, 2, 5, 40, 25);
  }

  if (volume > 5) {
    const cappedVolume = clamp(volume, 5, 20);
    rainScore = smoothLerp(cappedVolume, 5, 20, 25, 5);
  }

  // 2) Cenários principais

  // Pancada em dia quente limpo: janela excelente
  if (isSunnyWarmStable && isShowerScenario) {
    const minGoodVolume = 0.5;
    const maxGoodVolume = 3;
    const adjustedVolume = clamp(volume, minGoodVolume, maxGoodVolume);
    const showerBonus = smoothLerp(
      adjustedVolume,
      minGoodVolume,
      maxGoodVolume,
      80,
      100
    );
    rainScore = Math.max(rainScore, showerBonus);
  }

  // Pré-chuva em dia quente: muito bom
  if (volume === 0 && isWarmRange && probability >= 40) {
    const preRainScore = smoothLerp(probability, 40, 90, 75, 95);
    rainScore = Math.max(rainScore, preRainScore);
  }

  // Dia chuvoso frio sem chuva no momento: baixa o teto
  if (isColdRainScenario && volume === 0) {
    rainScore = Math.min(rainScore, 30);
  }

  // Dia chuvoso frio com chuva ativa: derruba forte
  if (isColdRainScenario && volume > 0) {
    const cappedVolume = clamp(volume, 0, 10);
    const coldRainPenalty = smoothLerp(cappedVolume, 0, 10, 20, 0);
    rainScore = Math.min(rainScore, coldRainPenalty);
  }

  // Temporal forte: quase inviável
  if (isStormScenario) {
    const cappedVolume = clamp(volume, 8, 30);
    const stormPenalty = smoothLerp(cappedVolume, 8, 30, 15, 0);
    rainScore = Math.min(rainScore, stormPenalty);
  }

  // 3) Ajustes por temperatura

  // Chuva com água fria: trava ainda mais
  if (isColdRange && volume > 0) {
    rainScore = rainScore * 0.4;
  }

  // Calor excessivo totalmente seco: reduz eficiência
  if (isHotRange && volume === 0 && probability === 0) {
    const hotAdjusted = smoothLerp(
      temperature,
      32,
      38,
      rainScore,
      rainScore * 0.5
    );
    rainScore = Math.min(rainScore, hotAdjusted);
  }

  // 4) Umidade extrema com chuva contínua: sufoca o cenário
  if (humidity > 95 && volume > 0 && !isShowerScenario) {
    rainScore = rainScore * 0.7;
  }

  return Math.round(clamp(rainScore, 0, 100));
}
