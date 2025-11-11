import {
  calTotalScore,
  environmentDataByFish,
} from "../../../shared/environment-data";
import { fishList } from "../../../shared/environment-data/types";

export type DayScore = Readonly<{
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
  hourlyScore: number;
}>;

export type DayScoreByFish = Readonly<Record<fishList, DayScore>>;

export function MakeDayScoreData(props: {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  probability: number;
  total: number;
  rain: number;
  showers: number;
  fishList: fishList[];
}): DayScoreByFish {
  const { calculateTotalScoreBySpecie } = calTotalScore;
  const result = calculateTotalScoreBySpecie(props, props.fishList);
  let scoreByFish = {} as Record<fishList, DayScore>;
  props.fishList.forEach((fish) => {
    const {
      hourlyScore,
      humidityScore,
      pressureScore,
      rainScore,
      tempScore,
      windScore,
    } = result[fish];

    scoreByFish[fish] = {
      time: props.time,
      temperature: { value: props.temperature, score: tempScore },
      humidity: { value: props.humidity, score: humidityScore },
      pressure: { value: props.pressure, score: pressureScore },
      windSpeed: { value: props.windSpeed, score: windScore },
      rain: {
        probability: props.probability,
        rain: props.rain,
        showers: props.showers,
        total: props.total,
        rainScore,
      },
      hourlyScore,
    };
  });

  return Object.freeze(scoreByFish);
}
