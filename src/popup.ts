export function renderState(enabled: boolean): void {
  const status = document.getElementById('status');
  const button = document.getElementById('toggleButton');

  if (status) {
    status.textContent = enabled ? 'Blocking Enabled' : 'Blocking Disabled';
  }

  if (button) {
    button.textContent = enabled ? 'Disable' : 'Enable';
  }
}

export async function toggleBlocking(currentState: boolean): Promise<void> {
  const newState = !currentState;

  await chrome.storage.local.set({ enabled: newState });
  await chrome.runtime.sendMessage({
    type: 'stateChanged',
    enabled: newState
  });

  renderState(newState);
} 