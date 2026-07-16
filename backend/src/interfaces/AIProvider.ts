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
  // Analyst Specific metrics
  whyCurrentSolutionsFail?: string;
  uniqueInsight?: string;
  estimatedDifficulty?: string;
  opportunityScore?: number;
  noveltyScore?: number;
  criticScore?: number;
  evidence?: string;
  rootCause?: string;
  innovationExplanation?: string;
  marketSize?: string;
  businessModel?: string;
  competitiveAdvantage?: string;
  automationStrategy?: string;
  aiUsage?: string;
  futureVision?: string;
  estimatedBuildTime?: string;
  riskFactors?: string;
  investorScore?: number;
  confidenceScore?: number;
  hiddenProblem?: string;
  behaviorAnalysis?: string;
  whyNobodySolvedIt?: string;
  market?: string;
  aiRole?: string;
  moat?: string;
  distributionStrategy?: string;
  mvp?: string;
  risks?: string;
  technicalComplexity?: string;
  behaviorInsight?: string;
  currentManualProcess?: string;
  crossIndustryInspiration?: string;
  aiStrategy?: string;
  pricing?: string;
  developmentDifficulty?: string;
  technicalStackRecommendation?: string[];
  expansionStrategy?: string[];
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
  getMockAnalysis(industry: string): AnalysisResponse;
}
