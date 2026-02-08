import { baseProfile } from "./base";
import type { ProfileWeights } from "./types";

export const documentationProfile: ProfileWeights = {
  ...baseProfile,
  structure: 1.3,
  readability: 1.3
};

