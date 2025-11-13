import { fishList } from "@env-data/types";

export interface ScoreQueryParams {
  latitude: number;
  longitude: number;
  datetime: Date;

  fishList: fishList[];
}
