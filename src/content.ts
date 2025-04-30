export function hideStaticAds(selectors: string[]): void {
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  });
}

export function watchDOM(selectors: string[]): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        hideStaticAds(selectors);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
}

export async function init(): Promise<void> {
  try {
    const result = await chrome.storage.local.get(['enabled', 'rules']);
    if (result.enabled && Array.isArray(result.rules)) {
      hideStaticAds(result.rules);
      watchDOM(result.rules);
    }
  } catch (error) {
    throw error;
  }
} 