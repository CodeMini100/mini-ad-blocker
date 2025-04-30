/**
 * @file jest.config.js
 * @description Jest configuration for the ad blocker extension
 */

/**
 * @typedef {import('@jest/types').Config.InitialOptions} JestConfig
 */

/**
 * Base Jest configuration for the project.
 * @type {JestConfig}
 */
const config = {
  /**
   * Defines the test environment to be used for testing.
   */
  testEnvironment: 'jsdom',

  /**
   * Displays individual test results with the test suite hierarchy.
   */
  verbose: true,

  /**
   * Collects test coverage information.
   */
  collectCoverage: true,

  /**
   * Specifies the output directory for coverage reports.
   */
  coverageDirectory: 'coverage',

  /**
   * An array of file extensions your modules use.
   */
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  /**
   * Transform files with ts-jest
   */
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  /**
   * Setup files to run before tests
   */
  setupFiles: ['<rootDir>/tests/setup.js'],

  /**
   * A set of global variables that need to be available in all test environments.
   */
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    },
    chrome: {
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
    }
  },

  /**
   * Module name mapper for handling path aliases
   */
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  /**
   * Test file patterns
   */
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ]
};

module.exports = config;