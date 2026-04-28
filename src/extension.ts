import * as vscode from "vscode";
import { fetchStockPrice } from "./stockFetcher";
import { StatusBarManager } from "./statusBarItem";
import { WebviewPanelManager } from "./webviewPanel";
import { getConfig, onConfigChange } from "./config";

let statusBar: StatusBarManager;
let webviewPanel: WebviewPanelManager;
let refreshTimer: NodeJS.Timer | null = null;
let lastPrice = null;
let lastNotificationPrice = 0;

export async function activate(context: vscode.ExtensionContext) {
  statusBar = new StatusBarManager();
  webviewPanel = new WebviewPanelManager();

  const outputChannel = vscode.window.createOutputChannel("SPIDJB Stock Viewer");
  outputChannel.appendLine("[SPIDJB] Extension activated");

  const config = getConfig();

  // Initial fetch
  await performFetch(outputChannel, config);

  // Setup refresh timer
  setupRefreshTimer(outputChannel, config);

  // Register commands
  const refreshCmd = vscode.commands.registerCommand("spidjb.refresh", async () => {
    outputChannel.appendLine("[SPIDJB] Manual refresh triggered");
    await performFetch(outputChannel, config);
  });

  const openPanelCmd = vscode.commands.registerCommand("spidjb.openPanel", () => {
    if (lastPrice) {
      webviewPanel.showPanel(context.extensionUri, lastPrice);
    }
  });

  const openNordnetCmd = vscode.commands.registerCommand("spidjb.openNordnet", () => {
    vscode.env.openExternal(
      vscode.Uri.parse(
        "https://www.nordnet.dk/investeringsforeninger/liste/sparindex-index-dj-bin-cl-wld-spidjb-xcse"
      )
    );
  });

  const toggleStatusBarCmd = vscode.commands.registerCommand("spidjb.toggleStatusBar", () => {
    const cfg = getConfig();
    cfg.showInStatusBar = !cfg.showInStatusBar;
    vscode.workspace
      .getConfiguration()
      .update("spidjb.showInStatusBar", cfg.showInStatusBar, vscode.ConfigurationTarget.Global);
  });

  // Handle configuration changes
  const configChangeDisposable = onConfigChange((newConfig) => {
    outputChannel.appendLine("[SPIDJB] Configuration changed");
    setupRefreshTimer(outputChannel, newConfig);
    if (lastPrice) {
      statusBar.updatePrice(lastPrice, newConfig);
    }
  });

  context.subscriptions.push(
    statusBar,
    refreshCmd,
    openPanelCmd,
    openNordnetCmd,
    toggleStatusBarCmd,
    configChangeDisposable,
    outputChannel
  );

  outputChannel.appendLine("[SPIDJB] Extension ready");
}

async function performFetch(outputChannel: vscode.OutputChannel, config: any) {
  const price = await fetchStockPrice();
  lastPrice = price;

  if (!price.isError) {
    outputChannel.appendLine(`[SPIDJB] ${price.ticker}: ${price.price.toFixed(2)} ${price.currency} (${price.changePercent > 0 ? "+" : ""}${price.changePercent.toFixed(2)}%)`);

    // Check alert threshold
    if (config.alertThreshold > 0 && Math.abs(price.changePercent) >= config.alertThreshold) {
      if (Math.abs(price.changePercent - lastNotificationPrice) > 0.1) {
        const direction = price.changePercent > 0 ? "📈 Up" : "📉 Down";
        vscode.window.showInformationMessage(
          `${price.ticker} ${direction} ${Math.abs(price.changePercent).toFixed(2)}%`
        );
        lastNotificationPrice = price.changePercent;
      }
    }
  } else {
    outputChannel.appendLine(`[SPIDJB] Error: ${price.errorMessage}`);
  }

  statusBar.updatePrice(price, config);
}

function setupRefreshTimer(outputChannel: vscode.OutputChannel, config: any) {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  const intervalMs = Math.max(60000, config.refreshInterval * 60000);
  outputChannel.appendLine(`[SPIDJB] Refresh interval set to ${config.refreshInterval} minutes`);

  refreshTimer = setInterval(async () => {
    await performFetch(outputChannel, config);
  }, intervalMs);
}

export function deactivate() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  statusBar.dispose();
  webviewPanel.dispose();
}
