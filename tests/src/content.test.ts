import { hideStaticAds, watchDOM, init } from '../../src/content';

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

describe('content.js', () => {
  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = `
      <div class="ad-container">
        <div class="ad">Advertisement 1</div>
        <div class="ad">Advertisement 2</div>
      </div>
      <div class="content">Real content</div>
    `;

    // Mock chrome API methods
    mockChrome.runtime.sendMessage.mockImplementation(() => {});
    mockChrome.storage.local.get.mockImplementation(() => Promise.resolve({}));
    mockChrome.storage.local.set.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('hideStaticAds()', () => {
    it('should hide elements matching ad selectors', () => {
      const adSelectors = ['.ad', '.advertisement'];
      hideStaticAds(adSelectors);

      const ads = document.querySelectorAll('.ad');
      ads.forEach(ad => {
        expect(ad).toHaveStyle({ display: 'none' });
      });
    });

    it('should not affect non-ad elements', () => {
      const adSelectors = ['.ad', '.advertisement'];
      hideStaticAds(adSelectors);

      const content = document.querySelector('.content');
      expect(content).not.toHaveStyle({ display: 'none' });
    });

  });

  describe('watchDOM()', () => {
    it('should observe DOM changes and hide new ads', () => {
      const adSelectors = ['.ad', '.advertisement'];
      const observer = watchDOM(adSelectors);

      // Add a new ad dynamically
      const newAd = document.createElement('div');
      newAd.className = 'ad';
      newAd.textContent = 'New Advertisement';
      document.body.appendChild(newAd);

      // Let the observer process the mutation
      jest.runAllTimers();

      expect(newAd).toHaveStyle({ display: 'none' });
      observer.disconnect();
    });
  });

  describe('init()', () => {
    it('should initialize ad blocking when enabled', async () => {
      mockChrome.storage.local.get.mockImplementation(() => 
        Promise.resolve({ enabled: true, rules: ['.ad', '.advertisement'] })
      );

      await init();

      const ads = document.querySelectorAll('.ad');
      ads.forEach(ad => {
        expect(ad).toHaveStyle({ display: 'none' });
      });
    });

    it('should not block ads when disabled', async () => {
      mockChrome.storage.local.get.mockImplementation(() => 
        Promise.resolve({ enabled: false, rules: ['.ad', '.advertisement'] })
      );

      await init();

      const ads = document.querySelectorAll('.ad');
      ads.forEach(ad => {
        expect(ad).not.toHaveStyle({ display: 'none' });
      });
    });

    it('should handle storage errors gracefully', async () => {
      mockChrome.storage.local.get.mockImplementation(() => 
        Promise.reject(new Error('Storage Error'))
      );

      await expect(init()).rejects.toThrow('Storage Error');
    });
  });
});});
