export interface RiskRatingResponse {
  riskRating: string;
  weightedScore: number;
  criticalCount: number;
  vulnerabilityCount: number;
  color: string;
}
