export interface Rule {
  id: number;
  priority: number;
  action: {
    type: string;
  };
  condition: {
    domains: string[];
  };
}

let nextRuleId = 1;

export function buildRules(rules: string[]): Rule[] {
  return rules.map(domain => ({
    id: nextRuleId++,
    priority: 1,
    action: {
      type: 'block'
    },
    condition: {
      domains: [domain]
    }
  }));
}

export async function loadInitialRules(): Promise<void> {
  try {
    const result = await chrome.storage.local.get('rules');
    const rules = result.rules || [];
    // Apply rules logic here
  } catch (error) {
    throw error;
  }
}

export function onStorageChange(changes: { [key: string]: { oldValue: any; newValue: any } }): void {
  if (changes.rules) {
    const rules = buildRules(changes.rules.newValue);
    // Apply updated rules logic here
  }
}

export function shouldBlock(url: string, rules: Rule[]): boolean {
  const hostname = new URL(url).hostname;
  return rules.some(rule => hostname.includes(rule.condition.domains[0]));
} 