import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildRules, loadInitialRules, onStorageChange, shouldBlock } from './background.js';

describe('background.js', () => {
  const mockBlockList = [
    '*.example.com',
    'ads.*',
    'subdomain.specificdomain.org',
  ];

  const mockChanges = {
    blockList: {
      oldValue: ['old.*'],
      newValue: mockBlockList,
    },
  };

  let originalChrome: typeof global.chrome;

  beforeEach(() => {
    // Backup original chrome object (if it exists) and mock it
    originalChrome = global.chrome;
    global.chrome = {
      declarativeNetRequest: {
        updateDynamicRules: vi.fn((options, callback) => callback?.()),
      },
      storage: {
        sync: {
          get: vi.fn(),
          set: vi.fn(),
        },
      },
    } as unknown as typeof global.chrome;
  });

  afterEach(() => {
    // Restore original chrome object
    vi.clearAllMocks();
    global.chrome = originalChrome;
  });

  describe('buildRules(blockList)', () => {
    it('should convert host wildcards to DNR rule objects correctly', () => {
      const rules = buildRules(mockBlockList);
      expect(rules).toBeDefined();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBe(mockBlockList.length);

      // Check some fields of the first rule
      const firstRule = rules[0];
      expect(firstRule.id).toBeNumber();
      expect(firstRule.action.type).toBe('block');
      expect(firstRule.condition.requestDomains).toContain('example.com');
    });

    it('should return an empty array if blockList is empty', () => {
      const rules = buildRules([]);
      expect(rules).toEqual([]);
    });

    it('should handle invalid entries safely', () => {
      const invalidList = ['*.valid.com', null as unknown as string, '', 'normal.com'];
      const rules = buildRules(invalidList);
      // Expect rules for only valid entries
      expect(rules.length).toBe(2);
      expect(rules[0].condition.requestDomains).toContain('valid.com');
      expect(rules[1].condition.requestDomains).toContain('normal.com');
    });
  });

  describe('loadInitialRules()', () => {
    it('should pull user list from storage, build rules, and apply them', async () => {
      // Mock storage response
      global.chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ blockList: mockBlockList });
      });

      await loadInitialRules();

      expect(global.chrome.storage.sync.get).toHaveBeenCalled();
      expect(global.chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
        {
          addRules: expect.any(Array),
          removeRuleIds: expect.any(Array),
        },
        expect.any(Function)
      );
    });

    it('should handle storage errors gracefully', async () => {
      // Force an error scenario
      global.chrome.storage.sync.get.mockImplementation((_, __) => {
        throw new Error('Storage Error');
      });

      await expect(loadInitialRules()).resolves.not.toThrow();
      // We expect no calls to updateDynamicRules in case of error
      expect(global.chrome.declarativeNetRequest.updateDynamicRules).not.toHaveBeenCalled();
    });
  });

  describe('onStorageChange(changes)', () => {
    it('should re-generate rules when the user updates blockList', () => {
      onStorageChange(mockChanges);
      expect(global.chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
        {
          addRules: expect.any(Array),
          removeRuleIds: expect.any(Array),
        },
        expect.any(Function)
      );
    });

    it('should not update rules if blockList key is not changed', () => {
      const noBlockListChanges = {
        someOtherKey: {
          oldValue: ['something'],
          newValue: ['somethingElse'],
        },
      };
      onStorageChange(noBlockListChanges);
      expect(global.chrome.declarativeNetRequest.updateDynamicRules).not.toHaveBeenCalled();
    });
  });

  describe('shouldBlock(url)', () => {
    it('should return true if URL matches the block list', () => {
      // We assume the blockList used within shouldBlock has been saved somewhere in the extension.
      // For test simplicity, we can call buildRules directly here to mock internal usage.
      const rules = buildRules(mockBlockList);

      // Typically, you'd set some internal state that shouldBlock retrieves. For the sake of testing:
      // We'll pass a known matching URL such as https://ads.subdomain.com
      const testUrl = 'https://ads.subdomain.com/page';
      const isBlocked = shouldBlock(testUrl, rules);
      expect(isBlocked).toBe(true);
    });

    it('should return false if URL does not match the block list', () => {
      const rules = buildRules(mockBlockList);
      const testUrl = 'https://allowedsite.com';
      const isBlocked = shouldBlock(testUrl, rules);
      expect(isBlocked).toBe(false);
    });
  });
});