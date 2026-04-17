export type Branch = 
  | "Computer Engineering"
  | "Information Technology"
  | "Mechanical Engineering"
  | "Civil Engineering"
  | "Electrical Engineering"
  | "Electronics & Telecommunication"
  | "Chemical Engineering"
  | "Instrumentation Engineering"
  | "Mechatronics"
  | "Aerospace Engineering"
  | "Biotechnology"
  | "Production Engineering"
  | "Automobile Engineering"
  | "Other";

export type Year = "1st" | "2nd" | "3rd" | "4th" | "Graduate";
export type Tier = "Tier 1" | "Tier 2" | "Tier 3";

export interface UserProfile {
  userId: number;
  university: string;
  college: string;
  branch: Branch;
  year: Year;
  cgpa?: string;
  tier: Tier;
  skills: {
    languages: string[];
    tools: string[];
    certifications: string[];
    projects: { title: string; description: string }[];
    internships: string[];
  };
  interests: string[];
  constraints: {
    financialPressure: boolean;
    immediateJob: boolean;
    relocation: boolean;
    higherStudiesBudget: string;
  };
}

export interface SkillGap {
  missingSkills: string[];
  priority: "High" | "Medium" | "Low";
  difficulty: number; // 1-10
  estimatedTime: string;
}

export interface SectorFit {
  sector: string;
  score: number;
  probability: number;
  justification: string;
  recommendations: string[];
}

export interface RoadmapStep {
  month: string;
  milestone: string;
  tasks: string[];
  resources: { name: string; url: string; type: "free" | "paid" }[];
  projects: string[];
  proTips?: string[];
}

export interface RecommendedSkill {
  skill: string;
  relevance: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  difficultyRationale: string;
  resources: string[];
}

export interface TargetJob {
  role: string;
  industry: string;
  companies: string[];
  reason: string;
  averageSalary: string;
}

export interface MarketInsight {
  trendingSkill: string;
  demandLevel: "High" | "Medium" | "Low";
  salaryRange: string;
  growthPercentage: number;
}

export interface AnalysisResult {
  skillGap: SkillGap[];
  recommendedSkills: RecommendedSkill[];
  targetJobs: TargetJob[];
  sectorFit: SectorFit[];
  jobProbability: {
    status: "Apply Now" | "Apply After 3 Months" | "Apply After 1 Year";
    percentage: number;
    reasoning: string;
  };
  roadmap: RoadmapStep[];
  strategy: {
    resumeTips: string[];
    atsKeywords: string[];
    linkedinTips: string[];
    platforms: string[];
    emailTemplate: string;
  };
  strategicAdvice?: {
    techStackRecommendation: string;
    systemDesignFocus: string;
    aiIntegrationTips: string;
    interviewMastery: string;
    devOpsEssentials: string;
  };
  careerSummary?: {
    compatibilityScore: number;
    recommendedRoles: string[];
    trendingRoles: string[];
    suitableIndustries: string[];
    hiringCompanies: string[];
    whyFit: string;
    nextSteps: string[];
  };
  strategicMetrics: {
    skills: number;
    interests: number;
    academicPerformance: number;
    marketDemand: number;
    strategy: number;
  };
  marketInsights: MarketInsight[];
}
