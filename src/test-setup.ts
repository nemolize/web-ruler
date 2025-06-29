import "@testing-library/jest-dom";

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.devicePixelRatio
Object.defineProperty(window, "devicePixelRatio", {
  value: 2,
  writable: true,
});

// Mock window.screen
Object.defineProperty(window, "screen", {
  value: {
    width: 1920,
    height: 1080,
  },
  writable: true,
});

// Mock window.innerWidth/innerHeight
Object.defineProperty(window, "innerWidth", {
  value: 1920,
  writable: true,
});

Object.defineProperty(window, "innerHeight", {
  value: 1080,
  writable: true,
});

// Mock window.visualViewport
Object.defineProperty(window, "visualViewport", {
  value: {
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
});
