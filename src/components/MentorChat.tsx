import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Minus, Maximize2 } from 'lucide-react';
import { chatWithMentor } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface MentorChatProps {
  analysis: AnalysisResult;
}

export const MentorChat: React.FC<MentorChatProps> = ({ analysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I'm your EngFoTech AI Mentor. Based on your profile, I can help you with specific career advice, interview strategy, or skill development. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = `
        Student Aim: High-package SDE Roles.
        Recommended Skills: ${analysis.recommendedSkills.map(s => s.skill).join(', ')}.
        Compatibility Score: ${analysis.careerSummary?.compatibilityScore}%.
        Next Steps: ${analysis.careerSummary?.nextSteps.join(', ')}.
      `;
      const response = await chatWithMentor(context, messages.concat({ role: 'user', content: userMessage }));
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Mentor Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-dark-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
          >
            <MessageSquare size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '600px',
              width: '400px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-dark-blue flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight leading-none">EngFoTech AI Mentor</h3>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-1">Always Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        msg.role === 'assistant' ? 'bg-dark-blue text-white' : 'bg-white text-dark-blue border border-slate-100'
                      }`}>
                        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                        msg.role === 'assistant' 
                          ? 'bg-white border border-slate-100 text-dark-blue' 
                          : 'bg-dark-blue text-white'
                      }`}>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-dark-blue text-white flex items-center justify-center animate-pulse">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-1 items-center">
                        <div className="w-1 h-1 bg-dark-blue/20 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-dark-blue/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-dark-blue/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-dark-blue focus:outline-none focus:border-dark-blue transition-all"
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="w-10 h-10 bg-dark-blue hover:bg-dark-blue-hover text-white rounded-xl shadow-lg flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 px-1">
                    <Sparkles size={10} className="text-dark-blue/20" />
                    <span className="text-[8px] font-black text-dark-blue/20 uppercase tracking-[0.2em]">High Performance AI Career Engine</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
