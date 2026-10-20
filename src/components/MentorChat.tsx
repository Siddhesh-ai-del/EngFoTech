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
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your EngFoTech AI Mentor. Based on your profile, I can help you with specific career advice, interview strategy, or skill development. How can I assist you today?",
    },
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
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Gemini responses are partial all the time — only read what exists.
      const recommendedSkills = Array.isArray(analysis?.recommendedSkills)
        ? analysis.recommendedSkills
        : [];
      const skillNames =
        recommendedSkills
          .filter((s) => s && typeof s.skill === 'string')
          .map((s) => s.skill)
          .join(', ') || 'Not available yet';
      const nextSteps = Array.isArray(analysis?.careerSummary?.nextSteps)
        ? analysis.careerSummary.nextSteps.join(', ')
        : 'Not available yet';
      const compatibilityScore = analysis?.careerSummary?.compatibilityScore ?? 'unknown';

      const context = `
        Student Aim: High-package SDE Roles.
        Recommended Skills: ${skillNames}.
        Compatibility Score: ${compatibilityScore}%.
        Next Steps: ${nextSteps}.
      `;
      const response = await chatWithMentor(
        context,
        messages.concat({ role: 'user', content: userMessage }),
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Mentor Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open EngFoTech AI Mentor chat"
            className="fixed bottom-6 right-6 w-14 h-14 bg-accent-fill text-white rounded-full shadow-pop flex items-center justify-center hover:brightness-110 active:scale-95 transition-all duration-150 z-50"
          >
            <MessageSquare size={24} aria-hidden="true" />
            <span
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green rounded-full border-2 border-surface"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '56px' : '600px',
              width: '400px',
            }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="EngFoTech AI Mentor chat"
            className="fixed bottom-6 right-6 bg-surface border border-separator rounded-2xl shadow-pop z-50 overflow-hidden flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-3 bg-surface border-b border-separator flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full bg-accent-fill text-white flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Bot size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold text-label leading-tight truncate">
                    EngFoTech AI Mentor
                  </h3>
                  <p className="text-[12px] text-label-2 leading-tight mt-0.5">Always Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                  className="btn-icon"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="btn-icon"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-canvas">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === 'assistant'
                            ? 'bg-accent-fill text-white'
                            : 'bg-inset text-label-2 border border-separator'
                        }`}
                        aria-hidden="true"
                      >
                        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-[15px] leading-relaxed ${
                          msg.role === 'assistant'
                            ? 'inset text-label'
                            : 'bg-accent-fill text-white'
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-accent-fill text-white flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Bot size={16} />
                      </div>
                      <div
                        className="inset p-3.5 rounded-2xl flex gap-1.5 items-center"
                        role="status"
                        aria-label="Mentor is typing"
                      >
                        <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-surface border-t border-separator shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      aria-label="Ask the AI mentor a question"
                      className="field flex-1"
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      aria-label="Send message"
                      className="btn-icon text-accent disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 px-1">
                    <Sparkles size={12} className="text-label-3" aria-hidden="true" />
                    <span className="text-[12px] text-label-2">
                      High Performance AI Career Engine
                    </span>
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
