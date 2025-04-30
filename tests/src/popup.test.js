import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderState, toggleBlocking } from './popup';

describe('popup.js', () => {
  let mockChrome: any;

  beforeEach(() => {
    // Mock the chrome API
    mockChrome = {
      storage: {
        sync: {
          get: vi.fn(),
          set: vi.fn()
        }
      },
      runtime: {
        sendMessage: vi.fn()
      }
    };

    // Attach mockChrome to global
    global.chrome = mockChrome as unknown as typeof chrome;

    // Prepare DOM element if needed for renderState
    document.body.innerHTML = `
      <div id="status"></div>
    `;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('renderState()', () => {
    it('should update the UI based on retrieved chrome.storage data', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation((_keys, callback) => {
        callback({ enabled: true });
      });

      // Act
      await renderState();

      // Assert
      expect(mockChrome.storage.sync.get).toHaveBeenCalledWith(['enabled'], expect.any(Function));
      const statusEl = document.getElementById('status');
      expect(statusEl?.textContent).toContain('Enabled');
    });

    it('should handle absence of data gracefully', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation((_keys, callback) => {
        callback({});
      });

      // Act
      await renderState();

      // Assert
      const statusEl = document.getElementById('status');
      expect(statusEl?.textContent).toContain('Disabled');
    });

    it('should handle unexpected errors in chrome.storage', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation(() => {
        throw new Error('Storage Error');
      });

      // Act & Assert
      await expect(renderState()).resolves.not.toThrow();
      // Confirm it fails gracefully (e.g., does not crash)
      const statusEl = document.getElementById('status');
      expect(statusEl?.textContent).toContain('Error');
    });
  });

  describe('toggleBlocking()', () => {
    it('should flip the enabled flag and send a message to the background script', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation((_keys, callback) => {
        callback({ enabled: false });
      });

      // Act
      await toggleBlocking();

      // Assert
      expect(mockChrome.storage.sync.get).toHaveBeenCalledTimes(1);
      expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({ enabled: true }, expect.any(Function));
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'toggle-blocking', enabled: true });
    });

    it('should handle error when retrieving current state', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation(() => {
        throw new Error('Get Error');
      });

      // Act & Assert
      await expect(toggleBlocking()).resolves.not.toThrow();
      expect(mockChrome.runtime.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle error when setting new state', async () => {
      // Arrange
      mockChrome.storage.sync.get.mockImplementation((_keys, callback) => {
        callback({ enabled: true });
      });
      mockChrome.storage.sync.set.mockImplementation(() => {
        throw new Error('Set Error');
      });

      // Act & Assert
      await expect(toggleBlocking()).resolves.not.toThrow();
      expect(mockChrome.runtime.sendMessage).not.toHaveBeenCalled();
    });
  });
});