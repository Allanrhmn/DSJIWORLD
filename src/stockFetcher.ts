import axios from "axios";
import * as cheerio from "cheerio";
import { StockPrice } from "./types";

const NORDNET_URL = "https://www.nordnet.dk/investeringsforeninger/liste/sparindex-index-dj-bin-cl-wld-spidjb-xcse";
const FUND_NAME = "SPARINDEX INDEX DJ BIN CL WLD";
const TICKER = "SPIDJB";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function fetchStockPrice(): Promise<StockPrice> {
  try {
    const response = await axios.get(NORDNET_URL, {
      headers,
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Parse price from multiple possible selectors (resilient to page changes)
    const selectors = [
      'span[data-testid="price"]',
      '[class*="price"]',
      '[data-field="price"]',
      ".js-price-value",
      ".price-value",
    ];

    let price: number | null = null;
    let change: number | null = null;
    let changePercent: number | null = null;

    // Try to find price
    for (const selector of selectors) {
      const found = $(selector).first().text().trim();
      if (found) {
        const parsed = parseFloat(found.replace(/[^\d\-.,]/g, "").replace(",", "."));
        if (!isNaN(parsed)) {
          price = parsed;
          break;
        }
      }
    }

    // Try to find change value
    const changeSelectors = [
      'span[data-testid="change"]',
      '[class*="change"]',
      "[data-field='change']",
      ".change-value",
    ];

    for (const selector of changeSelectors) {
      const found = $(selector).first().text().trim();
      if (found && found.includes("±")) {
        const parsed = parseFloat(found.replace(/[^\d\-.,]/g, "").replace(",", "."));
        if (!isNaN(parsed)) {
          change = parsed;
          break;
        }
      }
    }

    // Try to find percentage change
    const percentSelectors = [
      'span[data-testid="percent"]',
      '[class*="percent"]',
      "[data-field='percent']",
      ".percent-value",
    ];

    for (const selector of percentSelectors) {
      const found = $(selector).first().text().trim();
      if (found && found.includes("%")) {
        const parsed = parseFloat(found.replace(/[^\d\-.,]/g, "").replace(",", "."));
        if (!isNaN(parsed)) {
          changePercent = parsed;
          break;
        }
      }
    }

    if (price === null) {
      throw new Error("Could not parse price from Nordnet page");
    }

    return {
      ticker: TICKER,
      name: FUND_NAME,
      price: price,
      change: change ?? 0,
      changePercent: changePercent ?? 0,
      currency: "DKK",
      timestamp: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      ticker: TICKER,
      name: FUND_NAME,
      price: 0,
      change: 0,
      changePercent: 0,
      currency: "DKK",
      timestamp: new Date(),
      isError: true,
      errorMessage: `Failed to fetch: ${errorMessage}`,
    };
  }
}
