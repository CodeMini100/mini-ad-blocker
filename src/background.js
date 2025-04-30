// No external imports are currently required

/**
 * Convert a list of hostname wildcards into Declarative Net Request (DNR) rule objects.
 * @param {string[]} blockList - Array of hostname wildcards to block (e.g., ["*.example.com"]).
 * @returns {Object[]} Array of DNR rule objects.
 */
export function buildRules(blockList) {
  try {
    // TODO: Implement logic to build DNR rules based on the provided blockList.
    // Example rule structure for chrome.declarativeNetRequest:
    // {
    //   id: 1,
    //   priority: 1,
    //   action: { type: "block" },
    //   condition: { urlFilter: "example.com" }
    // }
    return blockList.map((hostname, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: 'block' },
      condition: {
        // TODO: Adjust condition to properly handle wildcards
        urlFilter: hostname.replace('*.', ''),
        resourceTypes: ['main_frame']
      }
    }));
  } catch (error) {
    console.error('Error building rules:', error);
    return [];
  }
}

/**
 * Load the initial user-defined block list from storage, build rules, and apply them.
 * This function is intended to run at startup or extension install.
 * @returns {Promise<void>}
 */
export async function loadInitialRules() {
  try {
    // TODO: Retrieve blockList from storage (e.g., chrome.storage.sync or local).
    // const { blockList } = await chrome.storage.sync.get({ blockList: [] });
    const blockList = []; // Placeholder
    
    const rules = buildRules(blockList);
    
    // TODO: Remove old dynamic rules and apply new ones
    // await chrome.declarativeNetRequest.updateDynamicRules({
    //   addRules: rules,
    //   removeRuleIds: rules.map(rule => rule.id)
    // });
  } catch (error) {
    console.error('Error loading initial rules:', error);
  }
}

/**
 * Handle changes to the user block list in storage and refresh the DNR rules.
 * @param {Object} changes - Changes object provided by chrome.storage.onChanged event.
 * @returns {Promise<void>}
 */
export async function onStorageChange(changes) {
  try {
    if (changes.blockList) {
      const { newValue: updatedList = [] } = changes.blockList;
      const rules = buildRules(updatedList);
      
      // TODO: Remove old dynamic rules and apply updated ones
      // await chrome.declarativeNetRequest.updateDynamicRules({
      //   addRules: rules,
      //   removeRuleIds: rules.map(rule => rule.id)
      // });
    }
  } catch (error) {
    console.error('Error updating rules on storage change:', error);
  }
}

/**
 * Determine whether a given URL should be blocked based on the block list.
 * @param {string} url - The URL to test against the current block list.
 * @returns {boolean} True if the URL matches a block rule, otherwise false.
 */
export function shouldBlock(url) {
  try {
    // TODO: Implement real logic to check if the provided URL is matched by the block list.
    // This is a placeholder returning false by default.
    return false;
  } catch (error) {
    console.error('Error determining block status:', error);
    return false;
  }
}