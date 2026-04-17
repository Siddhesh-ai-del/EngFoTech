import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ROUTES = [
  { path: '/', label: 'Dashboard' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/resume', label: 'Resume Analyzer' },
  { path: '/interview', label: 'Mock Interview' }
];

export const PageNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = ROUTES.findIndex(r => r.path === location.pathname);

  const goBack = () => {
    if (currentIndex > 0) {
      navigate(ROUTES[currentIndex - 1].path);
    }
  };

  const goNext = () => {
    if (currentIndex < ROUTES.length - 1) {
      navigate(ROUTES[currentIndex + 1].path);
    }
  };

  return (
    <div className="flex justify-between items-center gap-4 pt-12 mt-12 border-t border-slate-100 pb-12">
      <button
        onClick={goBack}
        disabled={currentIndex <= 0}
        className="px-6 py-3 rounded-2xl bg-slate-50 text-dark-blue font-bold hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-200"
      >
        <ChevronLeft size={18} />
        {currentIndex > 0 ? `Back to ${ROUTES[currentIndex - 1].label}` : 'Back'}
      </button>

      <button
        onClick={goNext}
        disabled={currentIndex >= ROUTES.length - 1}
        className="px-6 py-3 rounded-2xl bg-dark-blue text-white font-black hover:bg-dark-blue-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
      >
        {currentIndex < ROUTES.length - 1 ? `Next: ${ROUTES[currentIndex + 1].label}` : 'Next'}
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
