import { fishList } from "../../../../common/environment-data/types";

export interface ScoreQueryParams {
  latitude: number;
  longitude: number;
  datetime: Date;

  fishList: fishList[];
}
