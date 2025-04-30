import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hideStaticAds, watchDOM, init } from './content';

describe('content.js', () => {
  beforeEach(() => {
    // Clear and reset DOM before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('hideStaticAds()', () => {
    it('should hide elements matching ad selectors', () => {
      // Setup test DOM
      const adDiv = document.createElement('div');
      adDiv.className = 'ad-banner'; // Suppose "ad-banner" is a known selector
      document.body.appendChild(adDiv);

      // Call function under test
      hideStaticAds();

      // Expect that the ad banner is hidden (display = 'none')
      expect(adDiv.style.display).toBe('none');
    });

    it('should do nothing if no matching elements', () => {
      // No "ad" elements are present
      hideStaticAds();

      // Since no elements matched, just ensure nothing throws or changes
      expect(document.body.querySelectorAll('*').length).toBe(0);
    });
  });

  describe('watchDOM()', () => {
    let observerMock: vi.Mock;

    beforeEach(() => {
      // Mock the MutationObserver implementation
      observerMock = vi.fn(function (callback: MutationCallback) {
        const mockObserverInstance = {
          observe: vi.fn(),
          disconnect: vi.fn(),
          takeRecords: vi.fn()
        };
        // Provide a way to simulate the callback
        (mockObserverInstance as any).simulateMutations = (mutations: MutationRecord[]) => {
          callback(mutations, mockObserverInstance as unknown as MutationObserver);
        };
        return mockObserverInstance;
      });
      (global as any).MutationObserver = observerMock;
    });

    afterEach(() => {
      delete (global as any).MutationObserver;
    });

    it('should create a MutationObserver that hides newly added ad elements', () => {
      // Initialize watchDOM
      watchDOM();

      // The observer is created
      expect(observerMock).toHaveBeenCalledTimes(1);

      // Simulate new ad element insertion
      const mockObserverInstance = observerMock.mock.results[0].value;
      const newAdElement = document.createElement('div');
      newAdElement.className = 'ad-banner';

      // Trigger the callback with a mock mutation record
      mockObserverInstance.simulateMutations([
        {
          type: 'childList',
          target: document.body,
          addedNodes: [newAdElement],
          removedNodes: [] as any,
          attributeName: null,
          attributeNamespace: null,
          oldValue: null
        } as unknown as MutationRecord
      ]);

      // New ad element should be hidden
      expect(newAdElement.style.display).toBe('none');
    });

    it('should do nothing if MutationObserver is not supported', () => {
      delete (global as any).MutationObserver;

      // watchDOM should not throw if MutationObserver is undefined
      expect(() => watchDOM()).not.toThrow();
    });
  });

  describe('init()', () => {
    let addEventListenerSpy: vi.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
    });

    it('should call hideStaticAds and watchDOM if DOM already loaded', () => {
      // Mock readyState to be 'complete' so we simulate an already loaded DOM
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        configurable: true
      });

      // Spy on the functions to ensure they are called
      const hideStaticAdsSpy = vi.spyOn({ hideStaticAds }, 'hideStaticAds');
      const watchDOMSpy = vi.spyOn({ watchDOM }, 'watchDOM');

      // Call init
      init();

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(hideStaticAdsSpy).toHaveBeenCalledTimes(1);
      expect(watchDOMSpy).toHaveBeenCalledTimes(1);

      hideStaticAdsSpy.mockRestore();
      watchDOMSpy.mockRestore();
    });

    it('should add an event listener for DOMContentLoaded if DOM not yet loaded', () => {
      // Mock readyState to be 'loading'
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
        configurable: true
      });

      init();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'DOMContentLoaded',
        expect.any(Function)
      );
    });
  });
});