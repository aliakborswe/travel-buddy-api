/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MatchCriteria {
  destination?: string;
  startDate?: string;
  endDate?: string;
  interests?: string;
  travelType?: string;
  userId?: string;
}

export interface MatchResult {
  travelPlan: any;
  user: any;
  matchScore: number;
  commonInterests: string[];
}
