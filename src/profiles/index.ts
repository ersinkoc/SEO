import type { CategoryName, ProfileName } from "../types";
import { baseProfile } from "./base";
import { blogProfile } from "./blog";
import { documentationProfile } from "./documentation";
import { ecommerceProfile } from "./ecommerce";
import { landingProfile } from "./landing";
import { newsProfile } from "./news";
import { productProfile } from "./product";
import type { ProfileWeights } from "./types";

const profiles: Record<ProfileName, ProfileWeights> = {
  blog: blogProfile,
  product: productProfile,
  landing: landingProfile,
  news: newsProfile,
  documentation: documentationProfile,
  ecommerce: ecommerceProfile
};

export function getProfileWeights(profile: ProfileName): Record<CategoryName, number> {
  return profiles[profile] ?? baseProfile;
}
