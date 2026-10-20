import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

const ROUTES = [
  { path: '/', label: 'Dashboard' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/resume', label: 'Resume Analyzer' },
  { path: '/interview', label: 'Mock Interview' },
];

export const PageNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = ROUTES.findIndex((r) => r.path === location.pathname);

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
    <nav
      className="flex justify-between items-center gap-4 pt-12 mt-12 border-t border-separator pb-12"
      aria-label="Page navigation"
    >
      <Button variant="secondary" onClick={goBack} disabled={currentIndex <= 0}>
        <ChevronLeft size={18} aria-hidden="true" />
        {currentIndex > 0 ? `Back to ${ROUTES[currentIndex - 1].label}` : 'Back'}
      </Button>

      <Button variant="ghost" onClick={goNext} disabled={currentIndex >= ROUTES.length - 1}>
        {currentIndex < ROUTES.length - 1 ? `Next: ${ROUTES[currentIndex + 1].label}` : 'Next'}
        <ChevronRight size={18} aria-hidden="true" />
      </Button>
    </nav>
  );
};
