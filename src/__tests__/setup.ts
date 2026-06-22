import '@testing-library/jest-dom';

// Polyfill matchMedia (needed by antd in jsdom)
/* eslint-disable @typescript-eslint/no-empty-function */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
/* eslint-enable @typescript-eslint/no-empty-function */

// Polyfill ResizeObserver for jsdom (needed by antd Table virtual)
globalThis.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Trigger callback with empty entries to simulate initial observation
    this.callback([], this);
  }

  unobserve() {
    // ignore
  }

  disconnect() {
    // ignore
  }
};
