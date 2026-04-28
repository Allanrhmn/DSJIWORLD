# Changelog

All notable changes to the SPIDJB Stock Viewer extension will be documented in this file.

## [1.0.0] - 2026-04-28

### Added

- Initial release of SPIDJB Stock Viewer
- Real-time price display in VS Code status bar
- Automatic price refresh from Nordnet.dk
- Color-coded price change indicators (green/red)
- Detailed information panel (Webview)
- Configurable refresh interval (1-1440 minutes)
- Optional price change notifications
- Status bar position configuration (left/right)
- Manual refresh command
- Direct link to Nordnet fund page
- VS Code settings integration
- Output channel logging for debugging
- Support for Windows, macOS, and Linux

### Features

- Display SPIDJB (SPARINDEX INDEX DJ BIN CL WLD) current price and daily change
- Automatic HTML parsing from Nordnet.dk
- Graceful error handling with retry capability
- User-configurable alerts for significant price movements
- Responsive Webview panel with modern UI
- Keyboard shortcuts support for all commands

### Technical

- Built with TypeScript and VS Code Extension API
- Uses axios for HTTP requests
- Uses cheerio for server-side HTML parsing
- No external data APIs (directly scrapes Nordnet)
- Minimal dependencies for fast installation

---

## Future Versions

### [1.1.0] - Planned

- [ ] Support for additional funds
- [ ] Price history chart
- [ ] Portfolio tracking
- [ ] Advanced notification rules
- [ ] Custom alerts per time of day
- [ ] Performance metrics dashboard

### [2.0.0] - Planned

- [ ] Nordnet API integration (if available)
- [ ] Multiple fund support
- [ ] Full portfolio management
- [ ] Trend analysis
- [ ] Integration with trading platforms
