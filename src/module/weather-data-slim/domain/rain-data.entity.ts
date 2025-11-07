export type RainData = Readonly<{
  time: string;
  probability: number;
  total: number;
  rain: number;
  showers: number;
}>;

export function makeRainData(props: {
  time: string;
  probability: number;
  total: number;
  rain: number;
  showers: number;
}): RainData {
  return Object.freeze({
    time: props.time,
    probability: props.probability,
    total: props.total,
    rain: props.rain,
    showers: props.showers,
  });
}
