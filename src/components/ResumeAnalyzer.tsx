import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import { analyzeResume } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { PageNavigation } from './PageNavigation';
import { Button } from './ui/Button';
import { Card, SectionHeading } from './ui/Card';
import { Field } from './ui/Field';
import { Tag } from './ui/Tag';

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
      const errorMsg =
        err.message?.includes('429') || err.message?.includes('quota')
          ? 'The AI is currently experiencing high traffic (Rate Limit). Please wait a moment and try again.'
          : 'Failed to analyze resume. Please try again later.';
      setError(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Gemini responses are partial — never assume arrays exist.
  const score: number = typeof result?.score === 'number' ? result.score : 0;
  const missingKeywords: string[] = Array.isArray(result?.missingKeywords)
    ? result.missingKeywords
    : [];
  const suggestions: string[] = Array.isArray(result?.suggestions) ? result.suggestions : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      <header className="space-y-2">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-label">Resume Intelligence</h1>
        <p className="text-[15px] text-label-2">ATS Optimization for Engineering Markets</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-6">
          <Field label="Resume payload">
            {(props) => (
              <textarea
                {...props}
                className="field font-mono text-[13px] py-3 min-h-[350px] resize-none"
                placeholder="Paste raw resume text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </Field>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            loading={isAnalyzing}
            loadingLabel="Analyzing..."
          >
            Generate Audit
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              role="alert"
              className="p-3 bg-red/15 text-red-text rounded-[10px] flex items-start gap-3 text-[13px] font-medium leading-snug"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
              <p>{error}</p>
            </motion.div>
          )}
        </Card>

        <div className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="text-center">
                <p className="text-[13px] font-medium text-label-2 mb-4">Integrity Score</p>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90" aria-hidden="true">
                    <circle
                      className="text-inset"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-accent-fill"
                      strokeWidth="10"
                      strokeDasharray={351.8}
                      strokeDashoffset={351.8 - (351.8 * score) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute text-[28px] font-bold tracking-[-0.02em] text-label">
                    {score}
                  </span>
                </div>
              </Card>

              {/* Keywords */}
              <Card>
                <SectionHeading title="Missing Signals" level={3} className="mb-4" />
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw: string) => (
                    <Tag key={kw}>
                      <Sparkles size={12} className="text-label-3" aria-hidden="true" />
                      {kw}
                    </Tag>
                  ))}
                </div>
              </Card>

              {/* Suggestions */}
              <Card>
                <SectionHeading title="Audit Recommendations" level={3} className="mb-4" />
                <ul className="space-y-3">
                  {suggestions.map((s: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed text-label"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2"
                        aria-hidden="true"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ) : (
            <div className="inset border-dashed h-full flex flex-col items-center justify-center text-center p-8">
              <Upload size={32} className="mb-4 text-label-3" aria-hidden="true" />
              <p className="text-[13px] font-medium text-label-2 max-w-[220px] leading-snug">
                Waiting for resume payload to initialize deep audit
              </p>
            </div>
          )}
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};
