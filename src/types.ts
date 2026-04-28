export interface StockPrice {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  timestamp: Date;
  isError?: boolean;
  errorMessage?: string;
}

export interface ExtensionConfig {
  refreshInterval: number;
  showInStatusBar: boolean;
  alertThreshold: number;
  statusBarPosition: "left" | "right";
}
