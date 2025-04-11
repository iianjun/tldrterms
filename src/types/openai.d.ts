export interface OpenAIValidationResponse {
  language: "EN" | "KO" | "ETC";
  isTermsOrPrivacy: boolean;
}

export enum ScoreCategory {
  Privacy = "privacy",
  Transparency = "transparency",
  Rights = "rights",
  Security = "security",
  GeopoliticalRisk = "geopolitical_risk",
}
export enum ScoreRating {
  Good = "good",
  Bad = "bad",
  Neutral = "neutral",
}

export enum ScoreImportance {
  Minor = "minor",
  Major = "major",
  Critical = "critical",
}

export interface ScorePoint {
  category: ScoreCategory;
  caseId: number;
  rating: ScoreRating;
  importance: ScoreImportance;
  description: string;
}

export interface OpenAIAnalayzedResponse {
  score: number;
  points: ScorePoint[];
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
