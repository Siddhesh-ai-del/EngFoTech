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

// jsdom lacks IntersectionObserver, which motion/react's `whileInView`
// requires when components mount under test.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.assign(globalThis, { IntersectionObserver: IntersectionObserverStub });
}
