import * as vscode from "vscode";
import { ExtensionConfig } from "./types";

export function getConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("spidjb");

  return {
    refreshInterval: Math.max(1, config.get<number>("refreshInterval", 5)),
    showInStatusBar: config.get<boolean>("showInStatusBar", true),
    alertThreshold: Math.max(0, config.get<number>("alertThreshold", 0)),
    statusBarPosition: (config.get<string>("statusBarPosition", "right") || "right") as "left" | "right",
  };
}

export function onConfigChange(callback: (config: ExtensionConfig) => void): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("spidjb")) {
      callback(getConfig());
    }
  });
}
