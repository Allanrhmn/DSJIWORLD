# SPIDJB Stock Viewer

Real-time SPARINDEX fund price tracking directly in VS Code status bar.

## Features

- **Live Price Display** — See SPIDJB (SPARINDEX INDEX DJ BIN CL WLD) price in the status bar
- **Color-Coded Changes** — Green for gains, red for losses
- **Auto-Refresh** — Configurable refresh interval (default: 5 minutes)
- **Details Panel** — Click the status bar item to see full fund information
- **Smart Alerts** — Optional notifications when price moves beyond threshold
- **Nordnet Integration** — Direct link to fund page on Nordnet.dk

## Installation

1. Search for "SPIDJB Stock Viewer" in VS Code Extensions marketplace
2. Click Install
3. Reload VS Code

## Usage

### Status Bar Display

The extension shows the current price in the status bar:

```
SPIDJB • 142.50 DKK ▲ +0.80 (0.56%)
```

Click to open the detailed view.

### Commands

- **SPIDJB: Refresh Price** — Manually fetch the latest price
- **SPIDJB: Open Details** — Show the full details panel
- **SPIDJB: Open on Nordnet** — Open fund page in browser
- **SPIDJB: Toggle Status Bar** — Show/hide status bar item

## Settings

Configure the extension in VS Code Settings (`Ctrl+,`):

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `spidjb.refreshInterval` | number | 5 | Refresh interval in minutes (1-1440) |
| `spidjb.showInStatusBar` | boolean | true | Show price in status bar |
| `spidjb.alertThreshold` | number | 0 | Alert when change exceeds % (0 = disabled) |
| `spidjb.statusBarPosition` | string | right | Status bar position: "left" or "right" |

### Example Configuration

```json
{
  "spidjb.refreshInterval": 3,
  "spidjb.showInStatusBar": true,
  "spidjb.alertThreshold": 1.5,
  "spidjb.statusBarPosition": "right"
}
```

## How It Works

1. Extension fetches the Nordnet fund page
2. Parses the HTML to extract price, change, and percentage
3. Updates the status bar with color-coded display
4. Refreshes automatically on configured interval
5. Shows alerts if threshold is exceeded

## Data Source

Price data is sourced from:
- **Fund:** SPARINDEX INDEX DJ BIN CL WLD
- **Ticker:** SPIDJB (XCSE — Copenhagen Stock Exchange)
- **Provider:** Nordnet.dk

## Troubleshooting

### Price Not Updating

- Check VS Code Output channel: `SPIDJB Stock Viewer`
- Verify internet connection
- Try manually refreshing: `SPIDJB: Refresh Price`
- Restart VS Code

### Wrong Price Data

- The extension parses Nordnet's page structure
- If the page layout changes, parsing may fail
- Report issues: Open GitHub issue with screenshot

### Alerts Not Working

- Ensure `spidjb.alertThreshold` > 0
- Check it matches your expected threshold in %

## Performance

- Minimal memory footprint (~5 MB)
- Network requests use 5s timeout
- Respects configured refresh interval
- No background activity when idle

## Limitations

- Single fund tracking (SPIDJB only)
- No portfolio support (v1.0)
- No chart history (v1.0)
- Price data updated during Nordnet trading hours

## License

MIT

## Support

For issues, feature requests, or feedback:
- GitHub: [DSJIWORLD](https://github.com/Allanrhmn/DSJIWORLD)
- Report in Issues section

---

Made with ❤️ for developers who invest
