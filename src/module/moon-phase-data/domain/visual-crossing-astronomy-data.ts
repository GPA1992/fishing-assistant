export type VisualCrossingAstronomyData = Readonly<{
  date: string;
  sunrise: string;
  sunset: string;
  moonPhase: number;
  moonPhaseDescription: string;
  moonRise?: string;
  moonSet?: string;
}>;

export function makeVisualCrossingAstronomyData(props: {
  date: string;
  sunrise: string;
  sunset: string;
  moonPhase: number;
  moonRise?: string;
  moonSet?: string;
}): VisualCrossingAstronomyData {
  return Object.freeze({
    date: props.date,
    sunrise: props.sunrise,
    sunset: props.sunset,
    moonPhase: props.moonPhase,
    moonPhaseDescription: getMoonPhaseDescription(props.moonPhase),
    moonRise: props.moonRise,
    moonSet: props.moonSet,
  });
}

function toDate(time: string): Date {
  return new Date(`1970-01-01T${time}`);
}

export function dayLengthInSeconds(a: VisualCrossingAstronomyData): number {
  const sunrise = toDate(a.sunrise);
  const sunset = toDate(a.sunset);
  return (sunset.getTime() - sunrise.getTime()) / 1000;
}

export function getMoonPhaseDescription(moonPhase: number): string {
  const value = moonPhase;
  if (value === 0) return "Lua Nova";
  if (value > 0 && value < 0.25) return "Crescente Côncava";
  if (value === 0.25) return "Quarto Crescente";
  if (value > 0.25 && value < 0.5) return "Crescente Gibosa";
  if (value === 0.5) return "Lua Cheia";
  if (value > 0.5 && value < 0.75) return "Minguante Gibosa";
  if (value === 0.75) return "Quarto Minguante";
  return "Minguante Côncava";
}
