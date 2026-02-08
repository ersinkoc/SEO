import type { SeoInput, SeoPlugin, SeoReport } from "./types";

export class Kernel {
  private readonly plugins: SeoPlugin[] = [];

  public use(plugin: SeoPlugin): void {
    this.plugins.push(plugin);
  }

  public beforeAnalyze(input: SeoInput): void {
    for (const plugin of this.plugins) {
      plugin.beforeAnalyze?.(input);
    }
  }

  public afterAnalyze(report: SeoReport): SeoReport {
    let current = report;
    for (const plugin of this.plugins) {
      if (plugin.afterAnalyze) {
        current = plugin.afterAnalyze(current);
      }
    }
    return current;
  }
}

