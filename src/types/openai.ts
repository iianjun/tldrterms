import { Database } from "@/types/database.types";
export interface OpenAIValidationResponse {
  language: "EN" | "KO" | "ETC";
  isTermsOrPrivacy: boolean;
}

export type AnalyticPointCategory =
  Database["public"]["Enums"]["analytic_point_category"];
export type AnalyticPointImportance =
  Database["public"]["Enums"]["analytic_point_importance"];
export type AnalyticPointRating =
  Database["public"]["Enums"]["analytic_point_rating"];

export type AnalyticRoom =
  Database["public"]["Tables"]["analytic_rooms"]["Row"];
export type AnalyticPoint =
  Database["public"]["Tables"]["analytic_points"]["Row"];
export type Analytic = Database["public"]["Tables"]["analytics"]["Row"];

export interface OpenAIAnalayzedResponse {
  score: number;
  points: AnalyticPoint[];
  triggeredGeopoliticalRisk: boolean;
}

// #### 1. Privacy & Data Usage
// - 1.1: Data is collected only for core functionality
// - 1.2: Data is sold to third parties
// - 1.3: You can delete your account and data
// - 1.4: Data is stored indefinitely
// - 1.5: Service complies with GDPR/CCPA

// #### 2. Transparency
// - 2.1: Policy is easy to understand
// - 2.2: Changes to terms are clearly announced
// - 2.3: Terms can change without notification

// #### 3. User Rights
// - 3.1: You can access and export your data
// - 3.2: You retain ownership of your content
// - 3.3: Service can remove your account without cause
// - 3.4: Arbitration clause (you can't sue)

// #### 4. Security
// - 4.1: Data is encrypted in transit and at rest
// - 4.2: The service has a bug bounty program
// - 4.3: Weak or no mention of data protection

// #### 5. Geopolitical Risk (override)
// - G.1: Service stores or shares data with Chinese entities
