import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, FolderGit2, Plus, X, FileCode2, Terminal, Code2, Github, Figma, Box, PenTool, Server, Globe, Layout, Search, Settings, Laptop, Landmark, Factory, Rocket, Microscope, GraduationCap, Briefcase, CheckCircle2, IndianRupee, ChevronDown, Building } from 'lucide-react';
import { BRANCHES, YEARS, TIERS, CAREER_INTERESTS } from '../constants';
import { UserProfile } from '../types';

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
  "Core Engineering": Settings,
  "IT / Software": Laptop,
  "Government Jobs": Landmark,
  "PSU": Factory,
  "Startup": Rocket,
  "Research": Microscope,
  "Higher Studies": GraduationCap,
  "Business / Entrepreneurship": Briefcase
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    university: "",
    college: "",
    branch: "Computer Engineering",
    year: "1st",
    cgpa: "",
    tier: "Tier 1",
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
      higherStudiesBudget: "Low",
    },
  });

  const [langInput, setLangInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [projectInput, setProjectInput] = useState({ title: '', description: '' });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
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
    updateFormData({ skills: { ...formData.skills, languages: current.filter(l => l !== lang) } });
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
    updateFormData({ skills: { ...formData.skills, tools: current.filter(t => t !== tool) } });
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
    updateFormData({ skills: { ...formData.skills, projects: current.filter((_, i) => i !== index) } });
  };

  const toggleInterest = (interest: string) => {
    const interests = [...(formData.interests || [])];
    if (interests.includes(interest)) {
      updateFormData({ interests: interests.filter(i => i !== interest) });
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
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 flex-1 mr-8">
            {STEPS.map(s => (
              <div key={s.id} className="flex-1 relative">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    s.id <= step ? 'bg-black' : 'bg-slate-100'
                  }`}
                />
              </div>
            ))}
          </div>
          <span className="text-xs font-black text-black whitespace-nowrap uppercase tracking-widest">Step {step} of 4</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
        >
          {step === 1 && (
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight">Skills & Experience</h2>
                <p className="text-black/70 mt-2 font-medium">Tell us about your academic background and technical skills.</p>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">University Name</label>
                    <div className="relative">
                      <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-black font-medium focus:outline-none focus:border-black focus:bg-white transition-all" 
                        placeholder="e.g. University of Mumbai"
                        value={formData.university}
                        onChange={(e) => updateFormData({ university: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">College Name</label>
                    <div className="relative">
                      <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-black font-medium focus:outline-none focus:border-black focus:bg-white transition-all" 
                        placeholder="e.g. VJTI, DJ Sanghvi"
                        value={formData.college}
                        onChange={(e) => updateFormData({ college: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">Engineering Branch</label>
                    <div className="relative">
                      <Settings size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                      <select 
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-10 py-4 text-black font-medium focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
                        value={formData.branch}
                        onChange={(e) => updateFormData({ branch: e.target.value })}
                      >
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">Year</label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-black font-medium focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
                          value={formData.year}
                          onChange={(e) => updateFormData({ year: e.target.value })}
                        >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">Tier</label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-black font-medium focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
                          value={formData.tier}
                          onChange={(e) => updateFormData({ tier: e.target.value })}
                        >
                          {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">Programming Languages</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <AnimatePresence>
                        {formData.skills?.languages?.map(lang => (
                          <motion.span 
                            key={lang} 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }} 
                            className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 group"
                          >
                            {lang}
                            <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-white/50 hover:text-white transition-colors">
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      
                      <div className="relative">
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowLangDropdown(!showLangDropdown);
                            if (!showLangDropdown) setShowToolDropdown(false);
                          }} 
                          className="px-4 py-2 bg-slate-50 border border-slate-200 text-black rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
                        >
                          <Plus size={14} /> Add Language
                        </button>
                        
                        <AnimatePresence>
                          {showLangDropdown && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                            >
                              <div className="p-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-black transition-colors">
                                  <Search size={14} className="text-black/40" />
                                  <input 
                                    type="text"
                                    autoFocus
                                    className="bg-transparent border-none outline-none text-xs text-black placeholder:text-black/40 w-full font-medium"
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
                                {POPULAR_LANGUAGES.filter(l => l.name.toLowerCase().includes(langInput.toLowerCase())).map(lang => (
                                  <button
                                    key={lang.name}
                                    type="button"
                                    onClick={() => handleAddLanguage(lang.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-black/60 hover:bg-slate-50 hover:text-black rounded-xl transition-colors text-left"
                                  >
                                    <lang.icon size={16} className="text-black/40" />
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

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-1">Tools & Software</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <AnimatePresence>
                        {formData.skills?.tools?.map(tool => (
                          <motion.span 
                            key={tool} 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }} 
                            className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 group"
                          >
                            {tool}
                            <button type="button" onClick={() => handleRemoveTool(tool)} className="text-white/50 hover:text-white transition-colors">
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>

                      <div className="relative">
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowToolDropdown(!showToolDropdown);
                            if (!showToolDropdown) setShowLangDropdown(false);
                          }} 
                          className="px-4 py-2 bg-slate-50 border border-slate-200 text-black rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
                        >
                          <Plus size={14} /> Add Tool
                        </button>

                        <AnimatePresence>
                          {showToolDropdown && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                            >
                              <div className="p-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-black transition-colors">
                                  <Search size={14} className="text-black/40" />
                                  <input 
                                    type="text"
                                    autoFocus
                                    className="bg-transparent border-none outline-none text-xs text-black placeholder:text-black/40 w-full font-medium"
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
                                {POPULAR_TOOLS.filter(t => t.name.toLowerCase().includes(toolInput.toLowerCase())).map(tool => (
                                  <button
                                    key={tool.name}
                                    type="button"
                                    onClick={() => handleAddTool(tool.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-black/60 hover:bg-slate-50 hover:text-black rounded-xl transition-colors text-left"
                                  >
                                    <tool.icon size={16} className="text-black/40" />
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

                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <FolderGit2 size={20} className="text-black/40" />
                    Projects
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 space-y-4">
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black transition-all" 
                        placeholder="Project Title"
                        value={projectInput.title}
                        onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black transition-all min-h-[100px] resize-none" 
                        placeholder="Short description of what you built and technologies used..."
                        value={projectInput.description}
                        onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        onClick={handleAddProject} 
                        className="w-full py-3 bg-black text-white rounded-2xl font-black text-sm transition-all hover:bg-slate-900 flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Add Project
                      </button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {formData.skills?.projects?.map((proj: any, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 relative group hover:border-black transition-colors"
                          >
                            <button 
                              type="button"
                              onClick={() => handleRemoveProject(idx)} 
                              className="absolute top-4 right-4 text-black/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={18} />
                            </button>
                            <h4 className="font-bold text-black pr-8">{proj.title}</h4>
                            <p className="text-sm text-black/60 mt-2 leading-relaxed font-medium">{proj.description}</p>
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
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight">Career Interests</h2>
                <p className="text-black/60 mt-2 font-medium">Select the career paths you are interested in.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CAREER_INTERESTS.map(interest => {
                  const Icon = INTEREST_ICONS[interest] || Sparkles;
                  const isSelected = formData.interests?.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`relative p-6 rounded-[2rem] border text-left transition-all duration-300 flex flex-col gap-4 group ${
                        isSelected
                          ? 'bg-black border-black shadow-xl scale-[1.02]'
                          : 'bg-slate-50 border-slate-200 hover:border-black hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className={`p-3 rounded-2xl transition-colors ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-white text-black/40 group-hover:text-black'
                        }`}>
                          <Icon size={24} />
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-white"
                          >
                            <CheckCircle2 size={24} />
                          </motion.div>
                        )}
                      </div>
                      <span className={`font-black tracking-tight transition-colors ${
                        isSelected ? 'text-white' : 'text-black/60 group-hover:text-black'
                      }`}>
                        {interest}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight">Constraints & Preferences</h2>
                <p className="text-black/60 mt-2 font-medium">Tell us about your personal constraints so we can recommend the best career path.</p>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    id: 'financialPressure', 
                    icon: IndianRupee, 
                    title: 'Financial Pressure', 
                    desc: 'Need to support family soon?',
                    value: formData.constraints?.financialPressure 
                  },
                  { 
                    id: 'immediateJob', 
                    icon: Briefcase, 
                    title: 'Immediate Job Requirement', 
                    desc: 'Need a job right after graduation?',
                    value: formData.constraints?.immediateJob 
                  }
                ].map((constraint) => (
                  <div 
                    key={constraint.id}
                    onClick={() => updateFormData({ constraints: { ...formData.constraints, [constraint.id]: !constraint.value } })}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 group ${
                      constraint.value 
                        ? 'bg-black border-black shadow-lg scale-[1.01]' 
                        : 'bg-slate-50 border-slate-200 hover:border-black hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl transition-colors ${
                        constraint.value ? 'bg-white/10 text-white' : 'bg-white text-black/40 group-hover:text-black'
                      }`}>
                        <constraint.icon size={24} />
                      </div>
                      <div>
                        <p className={`font-black tracking-tight transition-colors ${constraint.value ? 'text-white' : 'text-black'}`}>{constraint.title}</p>
                        <p className={`text-sm font-medium transition-colors ${constraint.value ? 'text-white/60' : 'text-black/50'}`}>{constraint.desc}</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      constraint.value ? 'bg-white/20' : 'bg-slate-200'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        constraint.value ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                ))}

                <div className="p-6 rounded-[2rem] border bg-slate-50 border-slate-200 hover:border-black hover:bg-white transition-all duration-300 group">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="p-4 rounded-2xl bg-white text-black/40 group-hover:text-black transition-colors">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <p className="font-black tracking-tight text-black">Higher Studies Budget</p>
                      <p className="text-sm font-medium text-black/50">What is your budget for further education?</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-4 text-black font-bold focus:outline-none focus:border-black transition-all cursor-pointer"
                      value={formData.constraints?.higherStudiesBudget || "Medium"}
                      onChange={(e) => updateFormData({ constraints: { ...formData.constraints, higherStudiesBudget: e.target.value } })}
                    >
                      <option value="Low">Low (Scholarships only)</option>
                      <option value="Medium">Medium (Affordable programs)</option>
                      <option value="High">High (Flexible budget)</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-dark-blue/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 text-center py-12">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Sparkles size={48} className="text-dark-blue" />
              </div>
              <h2 className="text-4xl font-black text-dark-blue tracking-tight">Ready to Analyze</h2>
              <p className="text-dark-blue/60 max-w-md mx-auto font-medium text-lg">
                EngFoTech will analyze your profile to generate a personalized career roadmap and recommendations which is perfect for you...
              </p>
            </div>
          )}

          <div className={`mt-12 flex gap-4 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-8 py-4 rounded-2xl bg-slate-50 text-dark-blue font-bold hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-200"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-8 py-4 rounded-2xl bg-dark-blue text-white font-black hover:bg-dark-blue-hover transition-all flex items-center gap-2 shadow-lg"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => onSubmit(formData as any)}
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 rounded-2xl bg-dark-blue text-white font-black hover:bg-dark-blue-hover transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate My Career Path
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
