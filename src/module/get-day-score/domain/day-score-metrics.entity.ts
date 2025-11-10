export type ScoreData = Readonly<{
  climaticConditionsScore: {
    humidityScore: number;
    pressureScore: number;
    temperatureScore: number;
    windScore: number;
  };
  moonPhaseScore: { moonPhaseScore: number };
  rainScore: { rainScore: number };
  sololunarScore: {
    solunarDailyScore: number;
  };
}>;

export function makeScoreData(props: {
  climaticConditionsScore: {
    humidityScore: number;
    pressureScore: number;
    temperatureScore: number;
    windScore: number;
  };
  moonPhaseScore: { moonPhaseScore: number };
  rainScore: { rainScore: number };
  sololunarScore: {
    solunarDailyScore: number;
  };
}): ScoreData {
  return Object.freeze({
    climaticConditionsScore: props.climaticConditionsScore,
    moonPhaseScore: props.moonPhaseScore,
    rainScore: props.rainScore,
    sololunarScore: props.sololunarScore,
  });
}
