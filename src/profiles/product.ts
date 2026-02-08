import { baseProfile } from "./base";
import type { ProfileWeights } from "./types";

export const productProfile: ProfileWeights = {
  ...baseProfile,
  keyword: 1.2,
  structuredData: 1.3,
  ux: 1.2
};

