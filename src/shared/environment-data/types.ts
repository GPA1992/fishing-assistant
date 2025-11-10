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
