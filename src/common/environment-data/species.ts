export const SPECIES = ["traira"] as const;

export type fishList = (typeof SPECIES)[number];
