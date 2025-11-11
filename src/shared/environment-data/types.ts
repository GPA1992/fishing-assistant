export type RainContext = {
  volumeMmPerHour: number; // volume total de precipitação (mm/h)
  rainProbability: number; // probabilidade de chuva (0-100)
  showerVolumeMmPerHour: number; // volume de pancadas (mm/h)
  temperatureC: number; // temperatura (°C)
  humidityPct: number; // umidade relativa (%)
  pressure: number; // pressão (unidade consistente)
  windSpeed: number; // velocidade do vento (unidade consistente)
};

export type Period = { start: string; end: string };

export type SolunarInput = {
  sunRise: string; // "07:24"
  sunTransit: string; // "14:01"
  sunSet: string; // "20:37"
  moonRise: string; // "02:47"
  moonTransit: string; // "07:34"
  moonUnderfoot: string; // "20:01"
  moonSet: string; // "13:07"
  majorPeriods: Period[]; // ex: [{ start:"06:34", end:"08:33" }, ...]
  minorPeriods: Period[]; // ex: [{ start:"02:17", end:"03:17" }, ...]
};

export interface environmentDataType {
  climaticConditions: {
    temperature: string;
    humidity: string;
    pressure: string;
    wind: string;
  };
  rain: {
    volume: string;
    showers: string;
    probability: string;
  };
  moonPhase: {
    phase: string;
  };
  sololunar: {
    majorPeriods: string;
    minorPeriods: string;
    sunRise: string;
    moonRise: string;
    moonSet: string;
  };
}

export type calcScoreFunctions = {
  climaticConditionsCalc: {
    humidityScore: (h: number) => number;
    pressureScore: (p: number) => number;
    temperatureScore: (tempC: number) => number;
    windScore: (w: number) => number;
  };
  moonPhaseCalc: { moonPhaseScore: (phase: number) => number };
  rainCalc: { rainScore: (context: RainContext) => number };
  sololunarCalc: {
    solunarScores: (input: SolunarInput) => {
      solunarDailyScore: number;
      solunarHourlyScore: Record<number, number>;
    };
  };
};

export type calculateTotalScoreBySpecieType = {
  calculateTotalScoreBySpecie: (
    props: TotalCalcParams,
    fish: fishList[]
  ) => Record<fishList, TotalCalcResult>;
};
export type TotalCalcParams = Readonly<{
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  probability: number;
  total: number;
  rain: number;
  showers: number;
}>;

export type TotalCalcResult = Readonly<{
  tempScore: number;
  humidityScore: number;
  pressureScore: number;
  windScore: number;
  rainScore: number;
  hourlyScore: number;
}>;

export type fishList = "traira";
