import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, RefreshCcw } from 'lucide-react';
import { conductMockInterview } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { PageNavigation } from './PageNavigation';
import { Button } from './ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MockInterview: React.FC<{ context: string; analysis: AnalysisResult }> = ({
  context,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await conductMockInterview(context);
      setMessages([{ role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.message?.includes('429') || error.message?.includes('quota')
          ? 'The AI is currently experiencing high traffic (Rate Limit). Please wait a moment and try again.'
          : 'Failed to start the interview. Please check your connection and try again.';
      setMessages([{ role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off an async Gemini call on mount
      startInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await conductMockInterview(context, userMsg);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.message?.includes('429') || error.message?.includes('quota')
          ? 'Rate limit exceeded. Please wait a few seconds before sending your next message.'
          : 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="h-[calc(100vh-140px)] flex flex-col mb-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-label">
              Interview Simulator
            </h1>
            <p className="text-[15px] text-label-2">Profile-targeted practice environment</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setMessages([]);
              startInterview();
            }}
            disabled={isLoading}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Reset
          </Button>
        </header>

        <div className="card rounded-xl flex-1 flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.role === 'assistant' ? 'inset text-label' : 'bg-accent-fill text-white'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full bg-accent-fill text-white flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Bot size={16} />
                </div>
                <div
                  className="inset py-3 px-4 rounded-2xl flex gap-1.5 items-center"
                  role="status"
                  aria-label="Assistant is typing"
                >
                  <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-label-3 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-separator bg-surface">
            <div className="flex gap-3">
              <input
                type="text"
                aria-label="Type your response"
                className="field flex-1"
                placeholder="Type your response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Send response"
                className="btn-icon text-accent disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[12px] text-label-2 mt-3 flex items-center gap-1.5 justify-center">
              <Sparkles size={12} className="text-label-3" aria-hidden="true" />
              Professional AI Interview Logic Active
            </p>
          </div>
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};
