import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout } from './components/Layout';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';
import { RoadmapView } from './components/RoadmapView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MockInterview } from './components/MockInterview';
import { UserProfile, AnalysisResult } from './types';
import { generateCareerAnalysis } from './services/geminiService';
import { LogIn, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const user = event.data.user;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        fetchProfile(user.id);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser.id);
    }
  }, []);

  const fetchProfile = async (userId: number) => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        fetchRoadmap(userId);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoadmap = async (userId: number) => {
    try {
      const res = await fetch(`/api/roadmap/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setAuthError('');
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        fetchProfile(data.user.id);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Google login error:', error);
      setAuthError('Failed to initialize Google login');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    setAnalysis(null);
    localStorage.removeItem('user');
  };

  const handleOnboardingSubmit = async (onboardingData: Omit<UserProfile, 'userId'>) => {
    if (!user) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      // 1. Save Profile
      const profileToSave = { ...onboardingData, userId: user.id };
      const profileRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave),
      });

      if (profileRes.status === 401) {
        handleLogout();
        return;
      }

      if (!profileRes.ok) {
        throw new Error("Failed to save profile");
      }

      setProfile(profileToSave as UserProfile);

      // 2. Generate AI Analysis
      const aiResult = await generateCareerAnalysis(profileToSave as UserProfile);
      
      // 3. Save Roadmap
      const roadmapRes = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content: aiResult }),
      });

      if (roadmapRes.status === 401) {
        handleLogout();
        return;
      }
      
      setAnalysis(aiResult);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message?.includes("429") || error.message?.includes("quota")
        ? "The AI service is currently at capacity (Rate Limit). Please wait a minute and try again."
        : "Failed to generate your career path. Please try again later.";
      setGenerationError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-5xl w-full bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Left Side: Branding */}
          <div className="md:w-1/2 bg-dark-blue p-12 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-12 shadow-xl">
                <Sparkles size={32} className="text-white" />
              </div>
              <h1 className="text-5xl font-black mb-6 tracking-tighter leading-none">
                EngFo<span className="text-sky-400">Tech</span>
              </h1>
              <p className="text-xl text-white/70 font-medium max-w-xs -mt-2">
                Engineers Forward with technology
              </p>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-black text-xs">01</div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/60">Personalized Roadmaps</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-black text-xs">02</div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/60">ATS Resume Analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-black text-xs">03</div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/60">Mock Interview Simulation</p>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>

          {/* Right Side: Form */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-dark-blue tracking-tight">{isRegistering ? 'Join EngFoTech' : 'Welcome Back'}</h2>
                <p className="text-dark-blue/50 font-medium text-sm">Enter your details to access your career dashboard.</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center font-bold">
                    {authError}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-dark-blue uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-dark-blue focus:outline-none focus:border-dark-blue transition-all shadow-sm" 
                    placeholder="you@college.edu"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-dark-blue uppercase tracking-widest mb-2">Password</label>
                  <input 
                    type="password" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-dark-blue focus:outline-none focus:border-dark-blue transition-all shadow-sm" 
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-dark-blue hover:bg-dark-blue-hover text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  <LogIn size={18} />
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-dark-blue/50 hover:text-dark-blue font-black uppercase tracking-widest transition-colors"
                >
                  {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-white px-2 text-dark-blue/30">Or continue with</span></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-dark-blue font-black rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3 h-3" />
                Google OAuth
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !analysis) {
    return (
      <div className="min-h-screen p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-black text-dark-blue mb-4 tracking-tight">Welcome, {user.name}!</h1>
          <p className="text-dark-blue/70 font-medium text-lg">Let's build your structured career path. Tell us about yourself.</p>
        </div>
        
        {generationError && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <LogIn size={18} className="shrink-0" />
            <p>{generationError}</p>
          </div>
        )}

        <OnboardingForm onSubmit={handleOnboardingSubmit} isSubmitting={isGenerating} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard analysis={analysis} />} />
          <Route path="/roadmap" element={<RoadmapView roadmap={analysis.roadmap} />} />
          <Route path="/resume" element={<ResumeAnalyzer analysis={analysis} />} />
          <Route path="/interview" element={<MockInterview context={JSON.stringify(profile)} analysis={analysis} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
