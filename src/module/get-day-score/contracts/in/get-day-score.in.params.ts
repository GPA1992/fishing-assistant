import { fishList } from "../../../../shared/environment-data/types";

export interface ScoreQueryParams {
  latitude: number;
  longitude: number;
  datetime: Date;

  fishList: fishList[];
  timezone: number;
}
