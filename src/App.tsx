import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';
import { RoadmapView } from './components/RoadmapView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MockInterview } from './components/MockInterview';
import { UserProfile, AnalysisResult } from './types';
import { generateCareerAnalysis } from './services/geminiService';
import { clearStoredData, loadAnalysis, loadProfile, saveAnalysis, saveProfile } from './services/storage';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Restored lazily from this visitor's own browser — no login, no API round-trip.
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() => loadAnalysis());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleStartOver = () => {
    const confirmed = window.confirm(
      'Clear your saved profile and roadmap from this browser and start over?',
    );
    if (!confirmed) return;
    clearStoredData();
    setProfile(null);
    setAnalysis(null);
    setGenerationError(null);
  };

  const handleOnboardingSubmit = async (onboardingData: Omit<UserProfile, 'userId'>) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const aiResult = (await generateCareerAnalysis(onboardingData as UserProfile)) as AnalysisResult;
      const nextProfile = onboardingData as UserProfile;

      // Persist only after generation succeeded, so a failed run never leaves a
      // profile without its analysis — that combination strands the user at the
      // onboarding gate with an empty form.
      saveProfile(nextProfile);
      saveAnalysis(aiResult);

      setProfile(nextProfile);
      setAnalysis(aiResult);
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.message?.includes('GEMINI_API_KEY')
          ? error.message
          : error.message?.includes('429') || error.message?.includes('quota')
            ? 'The AI service is currently at capacity (Rate Limit). Please wait a minute and try again.'
            : 'Failed to generate your career path. Please try again later.';
      setGenerationError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!profile || !analysis) {
    return (
      <div className="min-h-screen p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-black text-dark-blue mb-4 tracking-tight">Welcome to EngFoTech</h1>
          <p className="text-dark-blue/70 font-medium text-lg">
            Let's build your structured career path. Tell us about yourself.
          </p>
        </div>

        {generationError && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={18} className="shrink-0" />
            <p>{generationError}</p>
          </div>
        )}

        <OnboardingForm onSubmit={handleOnboardingSubmit} isSubmitting={isGenerating} />
      </div>
    );
  }

  return (
    <Router>
      <Layout onStartOver={handleStartOver}>
        <Routes>
          <Route path="/" element={<Dashboard analysis={analysis} />} />
          <Route path="/roadmap" element={<RoadmapView roadmap={analysis.roadmap} />} />
          <Route path="/resume" element={<ResumeAnalyzer analysis={analysis} />} />
          <Route
            path="/interview"
            element={<MockInterview context={JSON.stringify(profile)} analysis={analysis} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
