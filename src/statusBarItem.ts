import * as vscode from "vscode";
import { StockPrice, ExtensionConfig } from "./types";

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private lastPrice: StockPrice | null = null;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = "spidjb.openPanel";
  }

  updatePrice(price: StockPrice, config: ExtensionConfig): void {
    this.lastPrice = price;

    if (!config.showInStatusBar) {
      this.statusBarItem.hide();
      return;
    }

    if (price.isError) {
      this.statusBarItem.text = `$(warning) ${price.ticker} — Error`;
      this.statusBarItem.tooltip = price.errorMessage || "Failed to fetch price";
      this.statusBarItem.color = new vscode.ThemeColor("errorForeground");
    } else {
      const arrow = price.change > 0 ? "▲" : price.change < 0 ? "▼" : "—";
      const changeStr = `${price.change > 0 ? "+" : ""}${price.change.toFixed(2)}`;
      const percentStr = `${price.changePercent > 0 ? "+" : ""}${price.changePercent.toFixed(2)}%`;

      this.statusBarItem.text = `${price.ticker} • ${price.price.toFixed(2)} ${price.currency} ${arrow} ${changeStr} (${percentStr})`;

      if (price.change > 0) {
        this.statusBarItem.color = new vscode.ThemeColor("charts.green");
      } else if (price.change < 0) {
        this.statusBarItem.color = new vscode.ThemeColor("charts.red");
      } else {
        this.statusBarItem.color = undefined;
      }

      const timestamp = price.timestamp.toLocaleTimeString();
      this.statusBarItem.tooltip = `${price.name}\n${price.price.toFixed(2)} ${price.currency} (${percentStr})\nUpdated: ${timestamp}`;
    }

    // Update position if needed
    if (config.statusBarPosition === "left") {
      this.statusBarItem.alignment = vscode.StatusBarAlignment.Left;
    } else {
      this.statusBarItem.alignment = vscode.StatusBarAlignment.Right;
    }

    this.statusBarItem.show();
  }

  show(): void {
    this.statusBarItem.show();
  }

  hide(): void {
    this.statusBarItem.hide();
  }

  getLastPrice(): StockPrice | null {
    return this.lastPrice;
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
