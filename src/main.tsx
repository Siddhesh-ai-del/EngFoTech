import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Apply the saved (or system) appearance before first paint.
 *
 * The theme lives on <html> so it works on every screen — including
 * onboarding, which never mounts the nav bar that owns the toggle.
 */
function applyStoredTheme(): void {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (stored !== 'light' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
  } catch (error) {
    // Storage unavailable (private mode) — fall back to the light appearance.
    console.error('Theme bootstrap failed:', error);
  }
}

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
