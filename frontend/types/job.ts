export type JobTier = 'LITE' | 'STANDARD' | 'PLUS';
export type JobStatus = 'CREATED' | 'SCOUT_ASSIGNED' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED' | 'CANCELLED';
export type Marketplace = 'FACEBOOK' | 'EBAY' | 'GUMTREE' | 'OTHER';
export type RiskRecommendation = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';

export interface Job {
  id: string;
  buyerId: string;
  scoutId?: string | null;
  status: JobStatus;
  tier: JobTier;
  listingUrl: string;
  marketplace: Marketplace;
  itemTitle: string;
  itemPrice: number | string;
  itemPhotos: string[];
  riskScore?: number;
  riskSignals?: string[];
  riskRecommendation?: RiskRecommendation;
  riskExplanation?: string;
  createdAt: string;
  updatedAt: string;
}
