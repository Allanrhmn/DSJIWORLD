import * as vscode from "vscode";
import { StockPrice } from "./types";

const NORDNET_URL = "https://www.nordnet.dk/investeringsforeninger/liste/sparindex-index-dj-bin-cl-wld-spidjb-xcse";

export class WebviewPanelManager {
  private panel: vscode.WebviewPanel | null = null;

  showPanel(extensionUri: vscode.Uri, price: StockPrice): void {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
    } else {
      this.panel = vscode.window.createWebviewPanel(
        "spidjbPanel",
        `${price.ticker} • ${price.price.toFixed(2)} ${price.currency}`,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
        }
      );

      this.panel.onDidDispose(() => {
        this.panel = null;
      });
    }

    this.panel.webview.html = this.getWebviewContent(price);
  }

  private getWebviewContent(price: StockPrice): string {
    const arrow = price.change > 0 ? "▲" : price.change < 0 ? "▼" : "—";
    const color = price.change > 0 ? "#10b981" : price.change < 0 ? "#ef4444" : "#9ca3af";
    const timestamp = price.timestamp.toLocaleString();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${price.ticker}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }

          .container {
            max-width: 500px;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            margin-bottom: 32px;
          }

          .ticker {
            font-size: 14px;
            color: var(--vscode-textLink-foreground);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .fund-name {
            font-size: 18px;
            color: var(--vscode-editor-foreground);
            margin-bottom: 20px;
            font-weight: 500;
          }

          .price-section {
            text-align: center;
            margin-bottom: 32px;
            padding: 24px;
            background: var(--vscode-editor-selectionBackground);
            border-radius: 8px;
          }

          .price-value {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 12px;
          }

          .price-currency {
            font-size: 20px;
            color: var(--vscode-textLink-foreground);
            margin-left: 8px;
          }

          .change-section {
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            color: ${color};
            margin-bottom: 24px;
          }

          .change-value {
            font-size: 24px;
            margin: 8px 0;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }

          .info-item {
            padding: 16px;
            background: var(--vscode-editor-selectionBackground);
            border-radius: 6px;
            text-align: center;
          }

          .info-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }

          .info-value {
            font-size: 16px;
            font-weight: 600;
          }

          .button-group {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }

          button {
            flex: 1;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
          }

          .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
          }

          .btn-primary:hover {
            background: var(--vscode-button-hoverBackground);
          }

          .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
          }

          .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
          }

          .error {
            padding: 16px;
            background: var(--vscode-errorForeground);
            opacity: 0.2;
            border-radius: 6px;
            color: var(--vscode-errorForeground);
            text-align: center;
            margin-bottom: 16px;
          }

          .timestamp {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${price.isError ? `<div class="error">⚠️ ${price.errorMessage}</div>` : ""}

          <div class="header">
            <div class="ticker">${price.ticker}</div>
            <div class="fund-name">${price.name}</div>
          </div>

          <div class="price-section">
            <div class="price-value">${price.price.toFixed(2)}<span class="price-currency">${price.currency}</span></div>
          </div>

          <div class="change-section">
            <div style="font-size: 28px; margin-bottom: 8px;">${arrow}</div>
            <div class="change-value">${price.change > 0 ? "+" : ""}${price.change.toFixed(2)} ${price.currency}</div>
            <div style="font-size: 18px;">${price.changePercent > 0 ? "+" : ""}${price.changePercent.toFixed(2)}%</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">${price.change > 0 ? "📈 Up" : price.change < 0 ? "📉 Down" : "➡️ Neutral"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Exchange</div>
              <div class="info-value">XCSE</div>
            </div>
          </div>

          <div class="button-group">
            <button class="btn-primary" onclick="refresh()">Refresh</button>
            <button class="btn-secondary" onclick="openNordnet()">View on Nordnet</button>
          </div>

          <div class="timestamp">Last updated: ${timestamp}</div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();

          function refresh() {
            vscode.postMessage({ command: 'refresh' });
          }

          function openNordnet() {
            vscode.postMessage({ command: 'openNordnet' });
          }

          window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'refresh') {
              location.reload();
            }
          });
        </script>
      </body>
      </html>
    `;
  }

  dispose(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = null;
    }
  }
}
