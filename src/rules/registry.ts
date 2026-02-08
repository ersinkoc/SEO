import { getBuiltInRules } from "./all";
import type { RuleDefinition } from "../types";

export class RuleRegistry {
  private readonly rules = new Map<string, RuleDefinition>();

  public constructor() {
    for (const rule of getBuiltInRules()) {
      this.rules.set(rule.id, rule);
    }
  }

  public add(rule: RuleDefinition): void {
    this.rules.set(rule.id, rule);
  }

  public getAll(): RuleDefinition[] {
    return [...this.rules.values()];
  }
}
