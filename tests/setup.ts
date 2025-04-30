/**
 * @file setup.js
 * @description Setup file for Jest tests
 */

import { jest } from '@jest/globals';

declare global {
  namespace NodeJS {
    interface Global {
      chrome: {
        runtime: {
          sendMessage: jest.Mock;
          onMessage: {
            addListener: jest.Mock;
          };
        };
        storage: {
          local: {
            get: jest.Mock;
            set: jest.Mock;
          };
        };
      };
    }
  }
}

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