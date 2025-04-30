/**
 * Renders the extension's current blocking state using data from chrome.storage.
 * @async
 * @function renderState
 * @returns {Promise<void>}
 * @throws {Error} If unable to retrieve data from storage.
 */
export async function renderState() {
  try {
    const { enabled } = await new Promise((resolve, reject) => {
      chrome.storage.sync.get('enabled', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(data);
      });
    });

    // TODO: Update UI elements based on the 'enabled' value
    // Example:
    // document.querySelector('#status').textContent = enabled ? 'Blocking is ON' : 'Blocking is OFF';
  } catch (error) {
    console.error('Error rendering state:', error);
    throw new Error('Failed to render state');
  }
}

/**
 * Flips the blocking enabled flag in chrome.storage and notifies the background script.
 * @async
 * @function toggleBlocking
 * @returns {Promise<void>}
 * @throws {Error} If unable to update storage or send message to the background script.
 */
export async function toggleBlocking() {
  try {
    const { enabled } = await new Promise((resolve, reject) => {
      chrome.storage.sync.get('enabled', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(data);
      });
    });

    const newState = !enabled;

    await new Promise((resolve, reject) => {
      chrome.storage.sync.set({ enabled: newState }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'TOGGLE_BLOCKING', payload: newState }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        // TODO: Handle any response needed from background script
        resolve(response);
      });
    });

    // TODO: Optionally call renderState() to refresh the UI
  } catch (error) {
    console.error('Error toggling blocking:', error);
    throw new Error('Failed to toggle blocking');
  }
}