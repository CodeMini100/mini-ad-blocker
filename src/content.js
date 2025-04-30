/**
 * Content script that hides ad containers missed by the network layer.
 * @module content
 */

/**
 * Hides elements matching static ad selectors.
 * @function
 * @returns {void}
 */
export function hideStaticAds() {
  try {
    const selectors = [
      '.ad-banner',
      '.sponsored-link',
      '.advertisement'
    ];
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element) {
          element.style.display = 'none';
        }
      });
    });
  } catch (error) {
    console.error('Error hiding static ads:', error);
  }
}

/**
 * Observes the DOM and hides newly added ad nodes.
 * @function
 * @returns {void}
 */
export function watchDOM() {
  try {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = /** @type {HTMLElement} */ (node);
              if (element.matches && (element.matches('.ad-banner, .sponsored-link, .advertisement'))) {
                element.style.display = 'none';
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.error('Error watching DOM:', error);
  }
}

/**
 * Bootstraps the content script logic on DOMContentLoaded.
 * @function
 * @returns {void}
 */
export function init() {
  try {
    document.addEventListener('DOMContentLoaded', () => {
      hideStaticAds();
      watchDOM();
    });
  } catch (error) {
    console.error('Error initializing content script:', error);
  }
}