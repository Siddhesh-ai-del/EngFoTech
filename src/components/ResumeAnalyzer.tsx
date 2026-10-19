import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Upload, CheckCircle, AlertCircle, Search, Sparkles } from 'lucide-react';
import { analyzeResume } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { PageNavigation } from './PageNavigation';

export const ResumeAnalyzer: React.FC<{ analysis: AnalysisResult }> = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeResume(text);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message?.includes("429") || err.message?.includes("quota")
        ? "The AI is currently experiencing high traffic (Rate Limit). Please wait a moment and try again."
        : "Failed to analyze resume. Please try again later.";
      setError(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-dark-blue dark:text-white tracking-tighter leading-none mt-4">Resume Intelligence</h2>
        <p className="text-dark-blue/40 dark:text-white/40 font-medium text-xs uppercase tracking-widest">ATS Optimization for Engineering Markets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card !p-6 space-y-6">
          <h3 className="font-black text-dark-blue dark:text-white flex items-center gap-2 uppercase tracking-widest text-[10px]">
            <FileText size={16} className="text-dark-blue dark:text-white/40" />
            Resume Payload
          </h3>
          <textarea
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono text-[11px] text-dark-blue/80 dark:text-white/60 focus:outline-none focus:border-dark-blue dark:focus:border-white focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[350px] resize-none"
            placeholder="Paste raw resume text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className="w-full py-3.5 bg-dark-blue dark:bg-white text-white dark:text-dark-blue font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-[10px]"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                <Search size={18} />
                Generate Audit
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-[10px] font-bold"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className="glass-card !p-6 text-center">
                <p className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-4">Integrity Score</p>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-dark-blue dark:text-white"
                      strokeWidth="10"
                      strokeDasharray={351.8}
                      strokeDashoffset={351.8 - (351.8 * result.score) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-dark-blue dark:text-white">{result.score}</span>
                </div>
              </div>

              {/* Keywords */}
              <div className="glass-card !p-6">
                <h4 className="font-black text-dark-blue dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-[9px]">
                  <Sparkles size={16} className="text-dark-blue dark:text-white/40" />
                  Missing Signals
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw: string) => (
                    <span key={kw} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-dark-blue dark:text-white/60 text-[9px] font-black rounded-lg border border-slate-100 dark:border-slate-700 uppercase tracking-widest">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-card !p-6">
                <h4 className="font-black text-dark-blue dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-[9px]">
                  <AlertCircle size={16} className="text-dark-blue dark:text-white/40" />
                  Audit Recommendations
                </h4>
                <ul className="space-y-3">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-dark-blue/80 dark:text-white/60 font-medium">
                      <div className="w-1 h-1 rounded-full bg-dark-blue dark:bg-white/40 shrink-0 mt-2" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-[2rem] h-full flex flex-col items-center justify-center text-center p-8 text-black/20 dark:text-white/10">
              <Upload size={40} className="mb-4 opacity-10 dark:opacity-5" />
              <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Waiting for resume payload to initialize deep audit</p>
            </div>
          )}
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};
