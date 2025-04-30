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

export function buildRules(rules: string[]): Rule[];
export function loadInitialRules(): Promise<void>;
export function onStorageChange(changes: { [key: string]: { oldValue: any; newValue: any } }): void;
export function shouldBlock(url: string, rules: Rule[]): boolean; 