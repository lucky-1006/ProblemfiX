import { SearchResult } from './SearchProvider';

export interface Problem {
  id: string;
  problem: string;
  description: string;
}

export interface Opportunity {
  id: string;
  problemId: string;
  problem: string;
  impactScore: number;        // 0-100
  frequencyScore: number;     // 0-100
  automationPotential: number; // 0-100
  opportunityScore: number;    // 0-100
}

export interface StartupIdea {
  id: string;
  problemId: string;
  name: string;
  problemStatement: string;
  targetCustomers: string;
  valueProposition: string;
  revenueModel: string;
  mvpFeatures: string[];
  // Build This Startup blueprint (Feature 6)
  landingPageHeadline: string;
  techStack: string[];
  apiSuggestions: string[];
  databaseRecommendation: string;
  developmentRoadmap: string[];
}

export interface Solution {
  id: string;
  problemId: string;
  currentProblem: string;
  recommendedSolution: string;
  implementationMethod: string;
  suggestedTools: string[];
  expectedBenefits: string[];
}

export interface AnalysisResponse {
  problems: Problem[];
  opportunities: Opportunity[];
  startupIdeas: StartupIdea[];
  solutions: Solution[];
}

export interface AIProvider {
  analyze(industry: string, searchResults: SearchResult[], modelId?: string): Promise<AnalysisResponse>;
}
