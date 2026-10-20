import {beforeEach, describe, expect, it} from 'vitest';
import {
  clearStoredData,
  loadAnalysis,
  loadProfile,
  saveAnalysis,
  saveProfile,
} from '../src/services/storage';
import {AnalysisResult, UserProfile} from '../src/types';

const PROFILE_KEY = 'engfotech.profile.v1';
const ANALYSIS_KEY = 'engfotech.analysis.v1';

const profile: UserProfile = {
  university: 'University of Mumbai',
  college: 'VJTI',
  branch: 'Computer Engineering',
  year: '3rd',
  cgpa: '8.5',
  tier: 'Tier 1',
  skills: {languages: ['TypeScript'], tools: ['Git'], certifications: [], projects: [], internships: []},
  interests: ['IT / Software'],
  constraints: {
    financialPressure: false,
    immediateJob: true,
    relocation: true,
    higherStudiesBudget: 'Low',
  },
};

const analysis: AnalysisResult = {
  skillGap: [],
  recommendedSkills: [],
  targetJobs: [],
  sectorFit: [],
  jobProbability: {status: 'Apply After 3 Months', percentage: 60, reasoning: 'test'},
  roadmap: [],
  strategy: {
    resumeTips: [],
    atsKeywords: [],
    linkedinTips: [],
    platforms: [],
    emailTemplate: '',
  },
  strategicMetrics: {
    skills: 80,
    interests: 70,
    academicPerformance: 75,
    marketDemand: 90,
    strategy: 65,
  },
  marketInsights: [],
};

beforeEach(() => {
  localStorage.clear();
});

describe('client-side storage', () => {
  it('round-trips a profile', () => {
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });

  it('round-trips an analysis', () => {
    saveAnalysis(analysis);
    expect(loadAnalysis()).toEqual(analysis);
  });

  it('returns null when nothing has been saved yet', () => {
    expect(loadProfile()).toBeNull();
    expect(loadAnalysis()).toBeNull();
  });

  it('returns null and clears a corrupt JSON entry', () => {
    localStorage.setItem(PROFILE_KEY, '{not json');
    localStorage.setItem(ANALYSIS_KEY, '][');

    expect(loadProfile()).toBeNull();
    expect(loadAnalysis()).toBeNull();
    expect(localStorage.getItem(PROFILE_KEY)).toBeNull();
    expect(localStorage.getItem(ANALYSIS_KEY)).toBeNull();
  });

  it('rejects a well-formed value of the wrong shape', () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({name: 'no university here'}));
    localStorage.setItem(ANALYSIS_KEY, JSON.stringify({roadmap: 'not an array'}));

    expect(loadProfile()).toBeNull();
    expect(loadAnalysis()).toBeNull();
    expect(localStorage.getItem(PROFILE_KEY)).toBeNull();
    expect(localStorage.getItem(ANALYSIS_KEY)).toBeNull();
  });

  it('clears both keys on start over', () => {
    saveProfile(profile);
    saveAnalysis(analysis);

    clearStoredData();

    expect(localStorage.getItem(PROFILE_KEY)).toBeNull();
    expect(localStorage.getItem(ANALYSIS_KEY)).toBeNull();
    expect(loadProfile()).toBeNull();
    expect(loadAnalysis()).toBeNull();
  });
});
