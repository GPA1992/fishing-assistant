export type sololunarGenerationParams = {
  lat: number;
  lon: number;
  date: string;
};

export type Sololunar = {
  sunRise: string;
  sunTransit: string;
  sunSet: string;
  moonRise: string;
  moonTransit: string;
  moonUnder: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
  sunRiseDec: number;
  sunTransitDec: number;
  sunSetDec: number;
  moonRiseDec: number;
  moonSetDec: number;
  moonTransitDec: number;
  moonUnderDec: number;
  minor1StartDec: number;
  minor1Start: string;
  minor1StopDec: number;
  minor1Stop: string;
  minor2StartDec: number;
  minor2Start: string;
  minor2StopDec: number;
  minor2Stop: string;
  major1StartDec: number;
  major1Start: string;
  major1StopDec: number;
  major1Stop: string;
  major2StartDec: number;
  major2Start: string;
  major2StopDec: number;
  major2Stop: string;
  dayRating: number;
  hourlyRating: HourlyRating;
};

export interface HourlyRating {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  "7": number;
  "8": number;
  "9": number;
  "10": number;
  "11": number;
  "12": number;
  "13": number;
  "14": number;
  "15": number;
  "16": number;
  "17": number;
  "18": number;
  "19": number;
  "20": number;
  "21": number;
  "22": number;
  "23": number;
}
