import '@testing-library/jest-dom/vitest';

// jsdom lacks a few browser APIs that Recharts/Motion reach for during render.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).ResizeObserver = ResizeObserverStub;
}
