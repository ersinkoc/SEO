import { baseProfile } from "./base";
import type { ProfileWeights } from "./types";

export const blogProfile: ProfileWeights = {
  ...baseProfile,
  content: 1.3,
  readability: 1.2,
  eeat: 1.2
};

