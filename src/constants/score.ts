export const CATEGORY_THRESHOLD = {
  lowCoverage: 0.45,
  harmful: 40.0,
  excellent: 62.5,
  good: 55.0,
  concerningMinor: 45.0,
};
export const CATEGORY_HIGH_NEGATIVE_THRESHOLD_PERCENT = 0.2;

export const PP_CRITERION_WEIGHTS = {
  // Category 1: Clarity & Accessibility (Total: 3)
  1.1: 1.0, // Language Clarity
  1.2: 1.0, // Structural Organization
  1.3: 1.0, // Contact Info Accessibility
  // Category 2: Data Collection Practices (Total: 6)
  2.1: 2.5, // Transparency on Data Collected
  2.2: 2.5, // Data Minimization
  2.3: 1.0, // Clarity on Collection Methods
  // Category 3: Data Usage Practices (Total: 6)
  3.1: 3.0, // Clarity/Specificity of Purpose
  3.2: 3.0, // Use for Secondary Purposes (Marketing/Ads)
  // Category 4: Data Sharing & Third Parties (Total: 9)
  4.1: 3.0, // Sharing with Third Parties (General)
  4.2: 3.5, // Sharing/Selling for Commercial Gain
  4.3: 2.5, // International Data Transfers
  // Category 5: User Control & Rights (Total: 10)
  5.1: 2.5, // Right to Access & Portability
  5.2: 2.0, // Right to Correction
  5.3: 3.0, // Right to Deletion
  5.4: 2.5, // Opt-Out Mechanisms
  // Category 6: Data Security & Retention (Total: 6)
  6.1: 2.5, // Transparency on Security Measures
  6.2: 3.5, // Data Retention Policy Clarity
  // Category 7: Policy Changes & Notification (Total: 2)
  7.1: 2.0, // Notification of Policy Changes
  // Category 8: Children's Privacy (Total: 2)
  8.1: 2.0, // Handling of Children's Data
};
