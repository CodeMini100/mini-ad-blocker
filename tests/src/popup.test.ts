import { renderState, toggleBlocking } from '../../src/popup';

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

describe('popup.js', () => {
  let mockChrome: any;

  beforeEach(() => {
    // Mock chrome API methods
    mockChrome.runtime.sendMessage.mockImplementation(() => {});
    mockChrome.storage.local.get.mockImplementation(() => Promise.resolve({}));
    mockChrome.storage.local.set.mockImplementation(() => Promise.resolve());

    // Reset the DOM
    document.body.innerHTML = `
      <div id="status">Loading...</div>
      <button id="toggleButton">Toggle</button>
    `;
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('renderState()', () => {
    it('should update UI elements based on blocking state', () => {
      const enabled = true;
      renderState(enabled);

      const status = document.getElementById('status');
      const button = document.getElementById('toggleButton');

      expect(status?.textContent).toBe('Blocking Enabled');
      expect(button?.textContent).toBe('Disable');
    });

    it('should handle disabled state correctly', () => {
      const enabled = false;
      renderState(enabled);

      const status = document.getElementById('status');
      const button = document.getElementById('toggleButton');

      expect(status?.textContent).toBe('Blocking Disabled');
      expect(button?.textContent).toBe('Enable');
    });
  });

  describe('toggleBlocking()', () => {
    it('should toggle blocking state and update storage', async () => {
      const currentState = false;
      await toggleBlocking(currentState);

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith({
        enabled: true
      });
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'stateChanged',
        enabled: true
      });
    });

    it('should handle errors gracefully', async () => {
      mockChrome.storage.local.set.mockImplementation(() => 
        Promise.reject(new Error('Storage Error'))
      );

      await expect(toggleBlocking(true)).rejects.toThrow('Storage Error');
    });
  });
});