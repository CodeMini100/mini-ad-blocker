/**
 * @file setup.js
 * @description Setup file for Jest tests
 */

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
};

// Mock window object
global.window = {
  location: {
    href: 'https://example.com'
  },
  document: {
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    createElement: jest.fn(),
    body: {
      appendChild: jest.fn()
    }
  }
};

// Mock console methods
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
}; 