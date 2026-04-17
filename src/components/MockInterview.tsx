import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, User, Bot, Sparkles, RefreshCcw, Briefcase, TrendingUp, Building2, Rocket, CheckCircle2 } from 'lucide-react';
import { conductMockInterview } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { PageNavigation } from './PageNavigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MockInterview: React.FC<{ context: string; analysis: AnalysisResult }> = ({ context, analysis }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      startInterview();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await conductMockInterview(context);
      setMessages([{ role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message?.includes("429") || error.message?.includes("quota")
        ? "The AI is currently experiencing high traffic (Rate Limit). Please wait a moment and try again."
        : "Failed to start the interview. Please check your connection and try again.";
      setMessages([{ role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await conductMockInterview(context, userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message?.includes("429") || error.message?.includes("quota")
        ? "Rate limit exceeded. Please wait a few seconds before sending your next message."
        : "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="h-[calc(100vh-140px)] flex flex-col mb-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-dark-blue dark:text-white flex items-center gap-2 mt-4 tracking-tighter">
              <MessageSquare className="text-dark-blue dark:text-white/40" size={20} />
              Interview Simulator
            </h2>
            <p className="text-[10px] text-dark-blue/40 dark:text-white/40 font-black uppercase tracking-widest">Profile-targeted practice environment</p>
          </div>
          <button 
            onClick={() => { setMessages([]); startInterview(); }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-dark-blue dark:text-white text-[9px] font-black rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all uppercase tracking-widest mt-4 shadow-sm"
          >
            <RefreshCcw size={12} />
            Reset
          </button>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'assistant' ? 'bg-dark-blue dark:bg-white text-white dark:text-dark-blue' : 'bg-slate-50 dark:bg-slate-800 text-dark-blue dark:text-white border border-slate-100 dark:border-slate-700'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-dark-blue dark:text-white/80 font-medium' 
                      : 'bg-dark-blue dark:bg-white text-white dark:text-dark-blue font-medium shadow-dark-blue/10'
                  }`}>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-dark-blue dark:bg-white text-white dark:text-dark-blue flex items-center justify-center animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-3 px-4 rounded-[1.5rem] flex gap-1 items-center">
                  <div className="w-1 h-1 bg-dark-blue/30 dark:bg-white/30 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-dark-blue/30 dark:bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-dark-blue/30 dark:bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-dark-blue dark:text-white focus:outline-none focus:border-dark-blue dark:focus:border-white transition-all shadow-sm"
                placeholder="Type your response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 bg-dark-blue dark:bg-white text-white dark:text-dark-blue rounded-xl shadow-lg flex items-center justify-center transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[8px] text-dark-blue/30 dark:text-white/20 mt-3 flex items-center gap-1.5 font-black uppercase tracking-widest justify-center">
              <Sparkles size={10} />
              Professional AI Interview Logic Active
            </p>
          </div>
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};
