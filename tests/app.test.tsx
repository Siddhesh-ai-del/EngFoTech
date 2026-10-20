import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import App from '../src/App';
import {loadAnalysis, loadProfile, saveAnalysis, saveProfile} from '../src/services/storage';
import {AnalysisResult, UserProfile} from '../src/types';

const sampleProfile: UserProfile = {
  university: 'University of Mumbai',
  college: 'VJTI',
  branch: 'Computer Engineering',
  year: '3rd',
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

const sampleAnalysis: AnalysisResult = {
  skillGap: [{missingSkills: ['Docker'], priority: 'Medium', difficulty: 4, estimatedTime: '2 weeks'}],
  recommendedSkills: [],
  targetJobs: [{role: 'Frontend Engineer', industry: 'IT', companies: [], reason: 'fit', averageSalary: '₹6 LPA'}],
  sectorFit: [],
  jobProbability: {status: 'Apply After 3 Months', percentage: 65, reasoning: 'test'},
  roadmap: [{month: 'Month 1', milestone: 'Ship a project', tasks: [], resources: [], projects: []}],
  strategy: {resumeTips: [], atsKeywords: [], linkedinTips: [], platforms: [], emailTemplate: ''},
  strategicMetrics: {
    skills: 80,
    interests: 70,
    academicPerformance: 75,
    marketDemand: 90,
    strategy: 65,
  },
  marketInsights: [],
};

function stubConfirm(returnValue: boolean) {
  const fn = vi.fn().mockReturnValue(returnValue);
  Object.defineProperty(window, 'confirm', {value: fn, writable: true, configurable: true});
  return fn;
}

beforeEach(() => {
  localStorage.clear();
  stubConfirm(true);
});

afterEach(cleanup);

describe('App without a server', () => {
  it('sends a first-time visitor straight to onboarding — no login screen', async () => {
    render(<App />);

    expect(await screen.findByText('Welcome to EngFoTech')).toBeInTheDocument();
    expect(screen.getByText('Skills & Experience')).toBeInTheDocument();

    expect(screen.queryByPlaceholderText('you@college.edu')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /sign in/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /create account/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /google oauth/i})).not.toBeInTheDocument();
    expect(screen.queryByText('Back to Login')).not.toBeInTheDocument();
  });

  it('restores a returning visitor straight into the app', async () => {
    saveProfile(sampleProfile);
    saveAnalysis(sampleAnalysis);

    render(<App />);

    expect(await screen.findByRole('link', {name: /dashboard/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /roadmap/i})).toBeInTheDocument();
    expect(screen.queryByText('Welcome to EngFoTech')).not.toBeInTheDocument();
    expect(screen.queryByText('Skills & Experience')).not.toBeInTheDocument();
  });

  it('keeps state in this browser after a full remount', () => {
    saveProfile(sampleProfile);
    saveAnalysis(sampleAnalysis);

    const {unmount} = render(<App />);
    unmount();

    render(<App />);

    expect(loadProfile()).toEqual(sampleProfile);
    expect(screen.queryByText('Welcome to EngFoTech')).not.toBeInTheDocument();
  });

  it('starts over — clearing stored data and returning to onboarding', async () => {
    saveProfile(sampleProfile);
    saveAnalysis(sampleAnalysis);
    const confirm = stubConfirm(true);
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('link', {name: /dashboard/i})).toBeInTheDocument();
    await user.click(screen.getByTitle(/start over/i));

    expect(confirm).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Welcome to EngFoTech')).toBeInTheDocument();
    expect(loadProfile()).toBeNull();
    expect(loadAnalysis()).toBeNull();
  });

  it('does not wipe stored data when the confirmation is declined', async () => {
    saveProfile(sampleProfile);
    saveAnalysis(sampleAnalysis);
    stubConfirm(false);
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('link', {name: /dashboard/i})).toBeInTheDocument();
    await user.click(screen.getByTitle(/start over/i));

    expect(screen.queryByText('Welcome to EngFoTech')).not.toBeInTheDocument();
    expect(loadProfile()).toEqual(sampleProfile);
    expect(loadAnalysis()).toEqual(sampleAnalysis);
  });
});
