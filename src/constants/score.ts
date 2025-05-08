export const CATEGORY_THRESHOLD = {
  lowCoverage: 0.45,
  harmful: 40.0,
  excellent: 62.5,
  good: 55.0,
  concerningMinor: 45.0,
};
export const CATEGORY_HIGH_NEGATIVE_THRESHOLD_PERCENT = 0.2;

export const PP_CRITERION_WEIGHTS = {
  // Category 1: Clarity & Accessibility (Total: 5)
  1.1: 1.7, // Language Clarity & Simplicity
  1.2: 1.7, // Structural Organization & Readability
  1.3: 1.6, // Accessibility of Privacy Contact Information
  // Category 2: Data Collection Practices (Total: 7)
  2.1: 3.0, // Transparency on Data Collected
  2.2: 3.0, // Principle of Data Minimization
  2.3: 1.0, // Clarity on Collection Methods
  // Category 3: Data Usage Practices (Total: 6)
  3.1: 3.0, // Clarity and Specificity of Purpose
  3.2: 3.0, // Use for Secondary Purposes (Marketing, Advertising)
  // Category 4: Data Sharing & Third Parties (Total: 9)
  4.1: 3.0, // Sharing with Third Parties (General)
  4.2: 4.0, // Sharing/Selling Data for Commercial Gain
  4.3: 2.0, // International Data Transfers
  // Category 5: User Control & Rights (Total: 10)
  5.1: 2.5, // Right to Access & Portability
  5.2: 2.0, // Right to Correction (Rectification)
  5.3: 3.0, // Right to Deletion (Erasure / "To Be Forgotten")
  5.4: 2.5, // Opt-Out Mechanisms (Marketing, Non-Essential Processing)
  // Category 6: Data Security & Retention (Total: 7)
  6.1: 4.0, // Transparency on Security Measures
  6.2: 3.0, // Data Retention Policy Clarity
  // Category 7: Policy Changes & Notification (Total: 4)
  7.1: 4.0, // Notification of Policy Changes
  // Category 8: Children's Privacy (Total: 2)
  8.1: 2.0, // Handling of Children's Data
};

export const TC_CRITERION_WEIGHTS = {
  // Category 1: Clarity & Accessibility (Total Weight: 6)
  1.1: 2.5, // Language Complexity
  1.2: 2.0, // Textual Organization Markers
  1.3: 1.5, // Definition of Key Terms
  // Category 2: User Rights & Obligations (Total Weight: 5.5)
  2.1: 2.5, // Scope of Service
  2.2: 3.0, // User Conduct Restrictions
  // Category 3: User-Generated Content (UGC) (Total Weight: 7)
  3.1: 3.5, // Ownership (Critical)
  3.2: 3.5, // License Grant (Critical)
  // Category 4: Fees, Payment, & Cancellation (Total Weight: 7)
  4.1: 2.5, // Fee Transparency
  4.2: 2.5, // Auto-Renewal Practices
  4.3: 1.0, // Refund Policy
  4.4: 1.0, // User Cancellation Rights
  // Category 5: Changes to Terms & Termination (Total Weight: 7.5)
  5.1: 3.5, // Modification of Terms
  5.2: 2.0, // Termination by Company
  5.3: 2.0, // Data/Content Handling After Termination
  // Category 6: Dispute Resolution (Total Weight: 9)
  6.1: 3.0, // Mandatory Arbitration Clause
  6.2: 3.5, // Class Action Waiver
  6.3: 2.5, // Governing Law and Venue
  // Category 7: Liability & Disclaimers (Total Weight: 8)
  7.1: 1.0, // Warranty Disclaimers
  7.2: 3.5, // Limitation of Liability (LoL)
  7.3: 3.5, // User Indemnification
};

export const TC_CRITERION_WEIGHTS_WO_PAYMENT = Object.fromEntries(
  Object.entries(TC_CRITERION_WEIGHTS).filter(([key]) => !key.startsWith("4."))
);
