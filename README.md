# IP Info - Node-RED Node

[![platform](https://img.shields.io/badge/platform-Node--RED-red?logo=nodered)](https://nodered.org)
![GitHub last commit](https://img.shields.io/github/last-commit/gautric/node-red-ipinfo/main)
[![Version](https://img.shields.io/npm/v/@gautric/node-red-ipinfo.svg)][def] 
[![Downloads](https://img.shields.io/npm/dt/@gautric/node-red-ipinfo.svg)][def]
[![License](https://img.shields.io/github/license/gautric/node-red-ipinfo)](https://github.com/gautric/node-red-ipinfo/blob/main/LICENSE)

<a href="https://www.buymeacoffee.com/gautric" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Overview

IP Info is a Node-RED node that provides detailed IP address information using the IPInfo.io service. This node allows you to easily retrieve geolocation, network, and other relevant details about an IP address within your Node-RED flows.

## Features

- Retrieve comprehensive IP address information
- Configurable caching to improve performance
- Customizable timeout settings
- Easy integration with Node-RED flows

## Prerequisites

- Node-RED
- IPInfo.io account (free tier available)

## Installation

You can install the node using one of the following methods:

### Node-RED Palette Manager
1. Open Node-RED
2. Go to Menu > Manage palette
3. Search for `@gautric/node-red-ipinfo`
4. Click Install

### Command Line

```sh
# Using npm
cd ~/.node-red
npm install --save @gautric/node-red-ipinfo

# Using yarn
cd ~/.node-red
yarn add @gautric/node-red-ipinfo
```

## Configuration 

### Node Configuration

- `input`: Specifies where to retrieve the IP address from the message (`msg.payload`)
- `output`: Defines where to put the result in the Node-RED flow (`msg.payload`)
- `name`: Custom name for the node instance

### IPInfo Config

- `name`: Name of the node configuration instance
- `token`: [Your IPInfo API Token](https://ipinfo.io/account/token)
  - Sign up at [IPInfo.io](https://ipinfo.io) to get your token
- `timeout`: Request timeout in milliseconds (default: `1000` ms)
- `cacheEnabled`: Enable/disable caching (default: `true`)
  - Improves performance and reduces API calls
- `maxitem`: Maximum number of items in the cache (default: `5000`)
- `ttl`: Time To Live (TTL) for cached items in milliseconds (default: `24 * 1000 * 60 * 60` ms)

## Usage Example

![Node-RED IP Info Node Screenshot](https://raw.githubusercontent.com/gautric/node-red-ipinfo/refs/heads/main/images/screenshot.png)

### Basic Flow Example

1. Drag the IP Info node into your flow
2. Configure the node with your IPInfo token
3. Connect input and output nodes as needed

## Contributing

Contributions are welcome! Please feel free to:

- Report bugs
- Suggest features
- Submit pull requests

### Reporting Issues

[Open an issue on GitHub](https://github.com/gautric/node-red-ipinfo/issues)

## Support

If this project helps you, consider:
- Starring the repository
- [Buying the developer a coffee](https://www.buymeacoffee.com/gautric)

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/gautric/node-red-ipinfo/blob/main/LICENSE) file for details.


[def]: https://www.npmjs.com/package/@gautric/node-red-ipinfo