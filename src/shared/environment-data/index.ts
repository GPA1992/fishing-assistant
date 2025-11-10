import traira from "./traira";
import { environmentDataType } from "./types";

export type FishList = "traira";
export const environmentData: Record<FishList, environmentDataType> = {
  traira: {
    ...traira,
  },
};
