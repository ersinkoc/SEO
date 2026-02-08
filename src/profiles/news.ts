import { baseProfile } from "./base";
import type { ProfileWeights } from "./types";

export const newsProfile: ProfileWeights = {
  ...baseProfile,
  eeat: 1.4,
  content: 1.2,
  technical: 1.2
};

