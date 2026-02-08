import { baseProfile } from "./base";
import type { ProfileWeights } from "./types";

export const ecommerceProfile: ProfileWeights = {
  ...baseProfile,
  keyword: 1.2,
  structuredData: 1.3,
  technical: 1.2
};

