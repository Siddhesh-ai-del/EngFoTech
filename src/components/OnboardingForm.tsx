import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  FolderGit2,
  Plus,
  X,
  FileCode2,
  Terminal,
  Code2,
  Github,
  Figma,
  Box,
  PenTool,
  Server,
  Globe,
  Layout,
  Search,
  Settings,
  Laptop,
  Landmark,
  Factory,
  Rocket,
  Microscope,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  ChevronDown,
} from 'lucide-react';
import { BRANCHES, YEARS, TIERS, CAREER_INTERESTS } from '../constants';
import { UserProfile } from '../types';
import { Button } from './ui/Button';
import { Field } from './ui/Field';

interface OnboardingFormProps {
  onSubmit: (profile: Omit<UserProfile, 'userId'>) => void;
  isSubmitting: boolean;
}

const POPULAR_LANGUAGES = [
  { name: 'C', icon: Terminal },
  { name: 'C++', icon: Terminal },
  { name: 'Python', icon: FileCode2 },
  { name: 'Java', icon: Code2 },
  { name: 'JavaScript', icon: FileCode2 },
  { name: 'TypeScript', icon: FileCode2 },
  { name: 'HTML', icon: Layout },
  { name: 'CSS', icon: Layout },
  { name: 'Go', icon: Terminal },
  { name: 'Rust', icon: Box },
];

const POPULAR_TOOLS = [
  { name: 'VS Code', icon: Code2 },
  { name: 'Git', icon: Terminal },
  { name: 'GitHub', icon: Github },
  { name: 'Docker', icon: Box },
  { name: 'AutoCAD', icon: PenTool },
  { name: 'Figma', icon: Figma },
  { name: 'Postman', icon: Globe },
  { name: 'Linux', icon: Server },
  { name: 'IntelliJ', icon: Code2 },
  { name: 'Android Studio', icon: Code2 },
];

const INTEREST_ICONS: Record<string, any> = {
  'Core Engineering': Settings,
  'IT / Software': Laptop,
  'Government Jobs': Landmark,
  PSU: Factory,
  Startup: Rocket,
  Research: Microscope,
  'Higher Studies': GraduationCap,
  'Business / Entrepreneurship': Briefcase,
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    university: '',
    college: '',
    branch: 'Computer Engineering',
    year: '1st',
    cgpa: '',
    tier: 'Tier 1',
    skills: {
      languages: [],
      tools: [],
      certifications: [],
      projects: [],
      internships: [],
    },
    interests: [],
    constraints: {
      financialPressure: false,
      immediateJob: false,
      relocation: true,
      higherStudiesBudget: 'Low',
    },
  });

  const [langInput, setLangInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [projectInput, setProjectInput] = useState({ title: '', description: '' });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleAddLanguage = (lang: string) => {
    if (!lang.trim()) return;
    const current = formData.skills?.languages || [];
    if (!current.includes(lang.trim())) {
      updateFormData({ skills: { ...formData.skills, languages: [...current, lang.trim()] } });
    }
    setLangInput('');
    setShowLangDropdown(false);
  };

  const handleRemoveLanguage = (lang: string) => {
    const current = formData.skills?.languages || [];
    updateFormData({
      skills: { ...formData.skills, languages: current.filter((l) => l !== lang) },
    });
  };

  const handleAddTool = (tool: string) => {
    if (!tool.trim()) return;
    const current = formData.skills?.tools || [];
    if (!current.includes(tool.trim())) {
      updateFormData({ skills: { ...formData.skills, tools: [...current, tool.trim()] } });
    }
    setToolInput('');
    setShowToolDropdown(false);
  };

  const handleRemoveTool = (tool: string) => {
    const current = formData.skills?.tools || [];
    updateFormData({ skills: { ...formData.skills, tools: current.filter((t) => t !== tool) } });
  };

  const handleAddProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!projectInput.title.trim() || !projectInput.description.trim()) return;
    const current = formData.skills?.projects || [];
    updateFormData({ skills: { ...formData.skills, projects: [...current, { ...projectInput }] } });
    setProjectInput({ title: '', description: '' });
  };

  const handleRemoveProject = (index: number) => {
    const current = formData.skills?.projects || [];
    updateFormData({
      skills: { ...formData.skills, projects: current.filter((_, i) => i !== index) },
    });
  };

  const toggleInterest = (interest: string) => {
    const interests = [...(formData.interests || [])];
    if (interests.includes(interest)) {
      updateFormData({ interests: interests.filter((i) => i !== interest) });
    } else {
      updateFormData({ interests: [...interests, interest] });
    }
  };

  const STEPS = [
    { id: 1, title: 'Skills' },
    { id: 2, title: 'Career Interests' },
    { id: 3, title: 'Constraints' },
    { id: 4, title: 'Career Analysis' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-6">
          {/* Decorative — the "Step N of 4" text below is the real status. */}
          <div className="flex gap-1.5 flex-1" aria-hidden="true">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s.id <= step ? 'bg-accent-fill' : 'bg-separator'
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] font-medium text-label-2 whitespace-nowrap">
            Step {step} of 4
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="card p-6 md:p-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-label">
                  Skills & Experience
                </h2>
                <p className="text-[15px] text-label-2 mt-2">
                  Tell us about your academic background and technical skills.
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <Field label="University name">
                    {(p) => (
                      <input
                        {...p}
                        type="text"
                        className="field"
                        placeholder="e.g. University of Mumbai"
                        value={formData.university}
                        onChange={(e) => updateFormData({ university: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="College name">
                    {(p) => (
                      <input
                        {...p}
                        type="text"
                        className="field"
                        placeholder="e.g. VJTI, DJ Sanghvi"
                        value={formData.college}
                        onChange={(e) => updateFormData({ college: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Engineering branch">
                    {(p) => (
                      <div className="relative">
                        <select
                          {...p}
                          className="field appearance-none cursor-pointer pr-10"
                          value={formData.branch}
                          onChange={(e) => updateFormData({ branch: e.target.value })}
                        >
                          {BRANCHES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                        />
                      </div>
                    )}
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Year">
                      {(p) => (
                        <div className="relative">
                          <select
                            {...p}
                            className="field appearance-none cursor-pointer pr-10"
                            value={formData.year}
                            onChange={(e) => updateFormData({ year: e.target.value })}
                          >
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                          />
                        </div>
                      )}
                    </Field>
                    <Field label="Tier">
                      {(p) => (
                        <div className="relative">
                          <select
                            {...p}
                            className="field appearance-none cursor-pointer pr-10"
                            value={formData.tier}
                            onChange={(e) => updateFormData({ tier: e.target.value })}
                          >
                            {TIERS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="space-y-2.5">
                    <p className="field-label">Programming languages</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <AnimatePresence>
                        {formData.skills?.languages?.map((lang) => (
                          <motion.span
                            key={lang}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="chip pr-1.5"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(lang)}
                              aria-label={`Remove ${lang}`}
                              className="text-label-2 hover:text-red-text transition-colors p-0.5 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowLangDropdown(!showLangDropdown);
                            if (!showLangDropdown) setShowToolDropdown(false);
                          }}
                        >
                          <Plus size={16} /> Add Language
                        </Button>

                        <AnimatePresence>
                          {showLangDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 mt-2 w-72 bg-surface border border-separator rounded-xl shadow-pop z-20 overflow-hidden"
                            >
                              <div className="p-3 border-b border-separator">
                                <div className="relative">
                                  <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                                  />
                                  <input
                                    type="text"
                                    autoFocus
                                    aria-label="Search languages"
                                    className="field pl-9 text-[14px]"
                                    placeholder="Search or add custom..."
                                    value={langInput}
                                    onChange={(e) => setLangInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddLanguage(langInput);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="p-2 max-h-60 overflow-y-auto">
                                {POPULAR_LANGUAGES.filter((l) =>
                                  l.name.toLowerCase().includes(langInput.toLowerCase()),
                                ).map((lang) => (
                                  <button
                                    key={lang.name}
                                    type="button"
                                    onClick={() => handleAddLanguage(lang.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] text-label hover:bg-inset transition-colors text-left"
                                  >
                                    <lang.icon size={16} className="text-label-2" />
                                    {lang.name}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="field-label">Tools & software</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <AnimatePresence>
                        {formData.skills?.tools?.map((tool) => (
                          <motion.span
                            key={tool}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="chip pr-1.5"
                          >
                            {tool}
                            <button
                              type="button"
                              onClick={() => handleRemoveTool(tool)}
                              aria-label={`Remove ${tool}`}
                              className="text-label-2 hover:text-red-text transition-colors p-0.5 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowToolDropdown(!showToolDropdown);
                            if (!showToolDropdown) setShowLangDropdown(false);
                          }}
                        >
                          <Plus size={16} /> Add Tool
                        </Button>

                        <AnimatePresence>
                          {showToolDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 mt-2 w-72 bg-surface border border-separator rounded-xl shadow-pop z-20 overflow-hidden"
                            >
                              <div className="p-3 border-b border-separator">
                                <div className="relative">
                                  <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                                  />
                                  <input
                                    type="text"
                                    autoFocus
                                    aria-label="Search tools"
                                    className="field pl-9 text-[14px]"
                                    placeholder="Search or add custom..."
                                    value={toolInput}
                                    onChange={(e) => setToolInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTool(toolInput);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="p-2 max-h-60 overflow-y-auto">
                                {POPULAR_TOOLS.filter((t) =>
                                  t.name.toLowerCase().includes(toolInput.toLowerCase()),
                                ).map((tool) => (
                                  <button
                                    key={tool.name}
                                    type="button"
                                    onClick={() => handleAddTool(tool.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] text-label hover:bg-inset transition-colors text-left"
                                  >
                                    <tool.icon size={16} className="text-label-2" />
                                    {tool.name}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-[20px] font-semibold text-label flex items-center gap-2">
                    <FolderGit2 size={18} className="text-label-2" />
                    Projects
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-surface border border-separator rounded-xl p-4 space-y-3">
                      <input
                        type="text"
                        aria-label="Project title"
                        className="field"
                        placeholder="Project Title"
                        value={projectInput.title}
                        onChange={(e) =>
                          setProjectInput((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                      <textarea
                        aria-label="Project description"
                        className="field py-3 min-h-[112px] resize-none leading-relaxed"
                        placeholder="Short description of what you built and technologies used..."
                        value={projectInput.description}
                        onChange={(e) =>
                          setProjectInput((prev) => ({ ...prev, description: e.target.value }))
                        }
                      />
                      <Button variant="secondary" className="w-full" onClick={handleAddProject}>
                        <Plus size={18} /> Add Project
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {formData.skills?.projects?.map((proj: any, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="bg-surface border border-separator rounded-xl p-4 relative group hover:border-label-3/50 transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => handleRemoveProject(idx)}
                              aria-label={`Remove project ${proj.title}`}
                              className="absolute top-3 right-3 text-label-2 hover:text-red-text opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1.5 rounded-full"
                            >
                              <X size={16} />
                            </button>
                            <h4 className="text-[15px] font-semibold text-label pr-8">
                              {proj.title}
                            </h4>
                            <p className="text-[14px] text-label-2 mt-1.5 leading-relaxed">
                              {proj.description}
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-label">
                  Career Interests
                </h2>
                <p className="text-[15px] text-label-2 mt-2">
                  Select the career paths you are interested in.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAREER_INTERESTS.map((interest) => {
                  const Icon = INTEREST_ICONS[interest] || Sparkles;
                  const isSelected = formData.interests?.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      aria-pressed={!!isSelected}
                      className={`relative p-4 rounded-xl border text-left transition-colors duration-200 flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-accent/10 border-accent/30'
                          : 'bg-surface border-separator hover:bg-inset/60'
                      }`}
                    >
                      <span
                        className={`p-2 rounded-[10px] shrink-0 ${isSelected ? 'bg-accent/15 text-accent' : 'bg-inset text-label-2'}`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="text-[15px] font-semibold text-label flex-1">
                        {interest}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15 }}
                          className="text-accent shrink-0"
                        >
                          <CheckCircle2 size={18} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-label">
                  Constraints & Preferences
                </h2>
                <p className="text-[15px] text-label-2 mt-2">
                  Tell us about your personal constraints so we can recommend the best career path.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    id: 'financialPressure',
                    icon: IndianRupee,
                    title: 'Financial Pressure',
                    desc: 'Need to support family soon?',
                    value: formData.constraints?.financialPressure,
                  },
                  {
                    id: 'immediateJob',
                    icon: Briefcase,
                    title: 'Immediate Job Requirement',
                    desc: 'Need a job right after graduation?',
                    value: formData.constraints?.immediateJob,
                  },
                ].map((constraint) => (
                  <button
                    key={constraint.id}
                    type="button"
                    role="switch"
                    aria-checked={!!constraint.value}
                    onClick={() =>
                      updateFormData({
                        constraints: {
                          ...formData.constraints,
                          [constraint.id]: !constraint.value,
                        },
                      })
                    }
                    className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer text-left transition-colors duration-200 ${
                      constraint.value
                        ? 'bg-accent/10 border-accent/30'
                        : 'bg-surface border-separator hover:bg-inset/60'
                    }`}
                  >
                    <span className="flex items-center gap-4 min-w-0">
                      <span
                        className={`p-2.5 rounded-[10px] shrink-0 ${constraint.value ? 'bg-accent/15 text-accent' : 'bg-inset text-label-2'}`}
                      >
                        <constraint.icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-label">
                          {constraint.title}
                        </span>
                        <span className="block text-[13px] text-label-2 mt-0.5">
                          {constraint.desc}
                        </span>
                      </span>
                    </span>
                    {/* iOS-style switch — state is carried by aria-checked above. */}
                    <span
                      className={`w-11 h-6 rounded-full p-[3px] shrink-0 transition-colors duration-200 ${
                        constraint.value ? 'bg-accent-fill' : 'bg-inset'
                      }`}
                    >
                      <span
                        className={`block w-[18px] h-[18px] bg-surface rounded-full shadow-sm transform transition-transform duration-200 ${
                          constraint.value ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </span>
                  </button>
                ))}

                <div className="bg-surface border border-separator rounded-xl p-4">
                  <Field
                    label="Higher studies budget"
                    hint="What is your budget for further education?"
                  >
                    {(p) => (
                      <div className="relative">
                        <select
                          {...p}
                          className="field appearance-none cursor-pointer pr-10 font-medium"
                          value={formData.constraints?.higherStudiesBudget || 'Medium'}
                          onChange={(e) =>
                            updateFormData({
                              constraints: {
                                ...formData.constraints,
                                higherStudiesBudget: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="Low">Low (Scholarships only)</option>
                          <option value="Medium">Medium (Affordable programs)</option>
                          <option value="High">High (Flexible budget)</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-label-2 pointer-events-none"
                        />
                      </div>
                    )}
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center py-10">
              <div className="w-16 h-16 bg-inset rounded-full flex items-center justify-center mx-auto">
                <Sparkles size={28} className="text-accent" />
              </div>
              <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-label">
                Ready to Analyze
              </h2>
              <p className="text-[15px] text-label-2 max-w-md mx-auto leading-relaxed">
                EngFoTech will analyze your profile to generate a personalized career roadmap and
                recommendations which is perfect for you...
              </p>
            </div>
          )}

          <div className={`mt-10 flex gap-3 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <Button variant="secondary" onClick={prevStep}>
                <ChevronLeft size={18} />
                Back
              </Button>
            )}

            {step < 4 ? (
              <Button variant="primary" onClick={nextStep}>
                Next
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => onSubmit(formData as any)}
                disabled={isSubmitting}
                loading={isSubmitting}
                loadingLabel="Processing…"
              >
                <Sparkles size={18} />
                Generate My Career Path
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
