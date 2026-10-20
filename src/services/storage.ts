import type {AnalysisResult, UserProfile} from '../types';

/**
 * Client-side persistence.
 *
 * The app no longer depends on the Express API for state, so everything the
 * visitor builds (their profile and the generated analysis) lives in their own
 * browser. That is what makes a static deploy (Vercel/Netlify/GitHub Pages)
 * fully functional instead of silently failing on every /api call.
 *
 * Keys are versioned so a future schema change can invalidate old data.
 */
const PROFILE_KEY = 'engfotech.profile.v1';
const ANALYSIS_KEY = 'engfotech.analysis.v1';

function read(key: string, isValid: (value: unknown) => boolean): any | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (!isValid(parsed)) throw new Error(`Stored value for ${key} has the wrong shape`);
    return parsed;
  } catch {
    // Corrupt or legacy data: drop it rather than white-screening on boot.
    localStorage.removeItem(key);
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Quota exceeded or storage disabled — the app still works in-memory,
    // so persistence failure must never break the flow.
    console.error(`Failed to persist ${key}:`, error);
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function loadProfile(): UserProfile | null {
  return read(PROFILE_KEY, (value) => isObject(value) && typeof value.university === 'string');
}

export function saveProfile(profile: UserProfile): void {
  write(PROFILE_KEY, profile);
}

export function loadAnalysis(): AnalysisResult | null {
  return read(
    ANALYSIS_KEY,
    (value) => isObject(value) && Array.isArray(value.roadmap) && Array.isArray(value.targetJobs),
  );
}

export function saveAnalysis(analysis: AnalysisResult): void {
  write(ANALYSIS_KEY, analysis);
}

export function clearStoredData(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(ANALYSIS_KEY);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
}
