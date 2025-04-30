import { buildRules, loadInitialRules, onStorageChange, shouldBlock, Rule } from '../../src/background';

// Mock Chrome API
const mockChrome = {
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

// Replace the global chrome object with our mock
(global as any).chrome = mockChrome;

describe('background.js', () => {
  const mockRules = {
    enabled: true,
    rules: ['example.com', 'ads.com']
  };

  beforeEach(() => {
    // Mock chrome API methods
    mockChrome.runtime.sendMessage.mockImplementation(() => {});
    mockChrome.storage.local.get.mockImplementation(() => Promise.resolve({}));
    mockChrome.storage.local.set.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('buildRules()', () => {
    it('should convert domain patterns to blocking rules', () => {
      const rules = buildRules(mockRules.rules);
      expect(rules).toBeInstanceOf(Array);
      expect(rules).toHaveLength(mockRules.rules.length);
      
      rules.forEach((rule: Rule, index: number) => {
        expect(rule).toHaveProperty('id');
        expect(rule).toHaveProperty('priority');
        expect(rule).toHaveProperty('action');
        expect(rule).toHaveProperty('condition');
        expect(rule.condition.domains).toContain(mockRules.rules[index]);
      });
    });
  });

  describe('loadInitialRules()', () => {
    it('should load rules from storage and apply them', async () => {
      mockChrome.storage.local.get.mockImplementation(() => 
        Promise.resolve({ rules: mockRules.rules })
      );

      await loadInitialRules();

      expect(mockChrome.storage.local.get).toHaveBeenCalled();
      // Add more specific assertions based on your implementation
    });

    it('should handle storage errors gracefully', async () => {
      mockChrome.storage.local.get.mockImplementation(() => 
        Promise.reject(new Error('Storage Error'))
      );

      await expect(loadInitialRules()).rejects.toThrow('Storage Error');
    });
  });

  describe('onStorageChange()', () => {
    it('should update rules when storage changes', () => {
      const changes = {
        rules: {
          newValue: mockRules.rules,
          oldValue: []
        }
      };

      onStorageChange(changes);
      // Add assertions based on your implementation
    });
  });

  describe('shouldBlock()', () => {
    it('should return true for blocked domains', () => {
      const rules = buildRules(mockRules.rules);
      expect(shouldBlock('https://ads.com/banner', rules)).toBe(true);
      expect(shouldBlock('https://example.com/page', rules)).toBe(true);
    });

    it('should return false for allowed domains', () => {
      const rules = buildRules(mockRules.rules);
      expect(shouldBlock('https://allowed.com/page', rules)).toBe(false);
    });
  });
});