# @gautric/node-red-ipinfo

[![platform](https://img.shields.io/badge/platform-Node--RED-red?logo=nodered)](https://nodered.org)
![GitHub last commit](https://img.shields.io/github/last-commit/gautric/node-red-ipinfo/main)
[![Version](https://img.shields.io/npm/v/@gautric/node-red-ipinfo.svg)][npm]
[![Downloads](https://img.shields.io/npm/dt/@gautric/node-red-ipinfo.svg)][npm]
[![License](https://img.shields.io/github/license/gautric/node-red-ipinfo)](https://github.com/gautric/node-red-ipinfo/blob/main/LICENSE)

<a href="https://www.buymeacoffee.com/gautric" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee" height="41" width="174"></a>

A Node-RED node that retrieves geolocation, network, and organization data for any IP address using the [IPInfo.io](https://ipinfo.io) API. Powered by the official [`node-ipinfo`](https://github.com/ipinfo/node) client library (v4.3.0).

---

## Features

- **IPv4 & IPv6** lookups with input validation
- **Configurable caching** (LRU) to reduce API calls and improve latency
- **Customizable** input/output message properties
- **Internationalized** status and error messages (i18n)
- **Includes example flow** importable from the Node-RED editor
- Built on **node-ipinfo 4.3.0** — the latest official IPInfo.io Node.js client

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | ≥ 18    |
| Node-RED    | ≥ 4.0.8 |
| node-ipinfo | ≥ 4.3.0 (installed automatically) |
| IPInfo.io account | Free tier available at [ipinfo.io/signup](https://ipinfo.io/signup) |

## Installation

### Node-RED Palette Manager

1. Open Node-RED → **Menu** → **Manage palette**
2. Search for `@gautric/node-red-ipinfo`
3. Click **Install**

### Command Line

```sh
cd ~/.node-red
npm install @gautric/node-red-ipinfo
```

## Quick Start

1. Drag an **ipinfo** node onto your flow.
2. Double-click it and create a new **IPInfo Config** node.
3. Paste your [API token](https://ipinfo.io/account/token) into the config.
4. Wire an **inject** node (payload = `8.8.8.8`) → **ipinfo** → **debug**.
5. Deploy and click inject.

## Node Reference

### ipinfo

Looks up geolocation data for the IP address found in the incoming message.

| Property | Default   | Description |
|----------|-----------|-------------|
| Input    | `msg.payload` | Message property containing the IP address (string) |
| Output   | `msg.payload` | Message property where the result object is stored |
| Config   | —         | IPInfo Config node to use |

#### Accepted input values

- Valid IPv4 address, e.g. `8.8.8.8`
- Valid IPv6 address, e.g. `2001:4860:4860::8888`
- The string `me` (returns info for the calling machine's public IP)

#### Output object

```jsonc
{
  "ip": "8.8.8.8",
  "hostname": "dns.google",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "loc": "37.4056,-122.0775",
  "org": "AS15169 Google LLC",
  "postal": "94043",
  "timezone": "America/Los_Angeles"
  // additional fields depend on your IPInfo.io plan
}
```

#### Status indicators

| Color / Shape | Meaning |
|---------------|---------|
| 🔵 dot        | Lookup in progress |
| 🟡 ring       | Invalid IP address (skipped) |
| 🔴 ring       | Configuration or input error |
| 🔴 dot        | API / network error |
| *(none)*      | Last lookup succeeded |

### ipinfo-config

Shared configuration node holding your API credentials and cache settings.

| Property     | Default       | Description |
|--------------|---------------|-------------|
| Name         | `IPInfo Config` | Display name |
| Token        | —             | Your IPInfo.io API token (stored as credential) |
| Timeout      | `1000` ms     | HTTP request timeout |
| Cache        | `false`       | Enable LRU caching |
| Max Items    | `5000`        | Maximum cached entries |
| TTL          | `86400000` ms (24 h) | Time-to-live per cache entry |

## Example Flow

An example flow is bundled with the node. Import it from:

**Menu** → **Import** → **Examples** → **@gautric/node-red-ipinfo**

![screenshot](https://raw.githubusercontent.com/gautric/node-red-ipinfo/refs/heads/main/images/screenshot.png)

## API Rate Limits

| Plan     | Requests / month |
|----------|-----------------|
| Free     | 50,000          |
| Basic    | 250,000         |
| Standard | 500,000         |
| Business | Custom          |

Enable caching in the config node to stay within limits.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Red "Missing configuration" status | Config node not linked | Double-click the ipinfo node and select a config |
| Red "Error" status after deploy | Invalid or missing API token | Check your token at [ipinfo.io/account/token](https://ipinfo.io/account/token) |
| Yellow "Invalid IP" status | Input is not a valid IP string | Ensure `msg.payload` contains a valid IPv4/IPv6 address |
| Timeout errors | Slow network or low timeout | Increase the timeout value in the config node |
| Rate limit errors (HTTP 429) | Too many requests | Enable caching or upgrade your IPInfo.io plan |

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [node-ipinfo](https://github.com/ipinfo/node) | ^4.3.0 | Official IPInfo.io Node.js client |

## Development

```sh
# Clone the repo
git clone https://github.com/gautric/node-red-ipinfo.git
cd node-red-ipinfo

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Add or update tests for your changes
4. Submit a pull request

[Open an issue](https://github.com/gautric/node-red-ipinfo/issues) for bugs or feature requests.

## Changelog

### 1.1.0

- Updated `node-ipinfo` dependency from 4.0.1 to 4.3.0
- Improved IPv6 validation (supports compressed and mixed notation)
- Added input validation for empty strings and missing token warnings
- Added `nodeDone` guard checks for backward compatibility with older Node-RED
- Added `files` field to `package.json` for leaner npm package
- Raised minimum Node.js version to ≥ 18 (12.x is EOL)
- Added unit tests
- Improved README with troubleshooting guide, API reference, and dependency docs
- Added i18n keys for all config labels

### 1.0.0

- Initial release

## License

[Apache-2.0](https://github.com/gautric/node-red-ipinfo/blob/main/LICENSE)

## Support

If this project helps you, consider [buying the developer a coffee](https://www.buymeacoffee.com/gautric). ☕

[npm]: https://www.npmjs.com/package/@gautric/node-red-ipinfo
