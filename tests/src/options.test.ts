import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadBlockList, saveBlockList, notifyBackground } from './options';

declare global {
  // Extend the global object for the chrome mock
  // (If you're using a dedicated types package for chrome, adjust accordingly.)
  /* eslint-disable no-var */
  var chrome: any;
}

describe('options.js', () => {
  beforeEach(() => {
    // Mock chrome APIs
    global.chrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
        },
      },
      runtime: {
        sendMessage: vi.fn(),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadBlockList()', () => {
    it('should retrieve the block list from chrome.storage', async () => {
      const mockBlockList = ['example.com', 'testsite.org'];
      global.chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ blockList: mockBlockList });
      });

      const result = await loadBlockList();
      expect(global.chrome.storage.local.get).toHaveBeenCalledWith(['blockList'], expect.any(Function));
      expect(result).toEqual(mockBlockList);
    });

    it('should return an empty array if no block list is found', async () => {
      global.chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const result = await loadBlockList();
      expect(result).toEqual([]);
    });

    it('should handle errors if chrome.storage.get fails', async () => {
      // Simulate an error by not calling the callback
      global.chrome.storage.local.get.mockImplementation(() => {
        throw new Error('Storage error');
      });

      await expect(loadBlockList()).rejects.toThrow('Storage error');
    });
  });

  describe('saveBlockList(list)', () => {
    it('should validate, deduplicate, and save the block list', async () => {
      const inputList = ['example.com', 'testsite.org', 'example.com', ''];
      const expectedList = ['example.com', 'testsite.org'];

      global.chrome.storage.local.set.mockImplementation((data, callback) => {
        callback && callback();
      });

      await saveBlockList(inputList);
      expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
        { blockList: expectedList },
        expect.any(Function)
      );
    });

    it('should reject if saving to chrome.storage fails', async () => {
      global.chrome.storage.local.set.mockImplementation(() => {
        throw new Error('Failed to set');
      });

      await expect(saveBlockList(['example.com'])).rejects.toThrow('Failed to set');
    });
  });

  describe('notifyBackground()', () => {
    it('should send a message to the background script to reload rules', () => {
      notifyBackground();
      expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'reloadRules' });
    });

    it('should handle errors if sendMessage fails', () => {
      global.chrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Could not send message');
      });

      expect(() => notifyBackground()).toThrow('Could not send message');
    });
  });
});