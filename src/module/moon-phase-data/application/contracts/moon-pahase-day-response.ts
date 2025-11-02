import { VisualCrossingAstronomyData } from "../../domain/visual-crossing-astronomy-data";


export interface MoonPhaseDataResponse {
  daily: VisualCrossingAstronomyData[];
  targetDay :VisualCrossingAstronomyData;
}
