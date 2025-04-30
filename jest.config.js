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
  preset: 'ts-jest',
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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  /**
   * Transform files with ts-jest
   */
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },

  /**
   * Setup files to run before tests
   */
  setupFiles: ['<rootDir>/tests/setup.ts'],

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