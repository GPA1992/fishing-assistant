export type HourlyScore = Readonly<{
  time: string;
  temperature: { value: number; score: number };
  humidity: { value: number; score: number };
  pressure: { value: number; score: number };
  windSpeed: { value: number; score: number };
  rain: {
    probability: number;
    rain: number;
    showers: number;
    total: number;
    rainScore: number;
  };
  hourBonus: number;
  hourlyScore: number;
}>;

export function MakeDayScoreData(props: {
  time: string;
  temperature: { value: number; score: number };
  humidity: { value: number; score: number };
  pressure: { value: number; score: number };
  windSpeed: { value: number; score: number };
  rain: {
    probability: number;
    rain: number;
    showers: number;
    total: number;
    rainScore: number;
  };
  hourBonus: number;
  hourlyScore: number;
}): HourlyScore {
  return Object.freeze({ ...props });
}
