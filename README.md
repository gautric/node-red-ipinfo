# IP Info - Node-RED 

[![platform](https://img.shields.io/badge/platform-Node--RED-red?logo=nodered)](https://nodered.org)
![GitHub last commit](https://img.shields.io/github/last-commit/gautric/node-red-ipinfo/main)
[![Version](https://img.shields.io/npm/v/@gautric/node-red-ipinfo.svg)](https://www.npmjs.com/package/@gautric/node-red-ipinfo) 
[![Downloads](https://img.shields.io/npm/dt/@gautric/node-red-ipinfo.svg)](https://www.npmjs.com/package/@gautric/node-red-ipinfo) 

<a href="https://www.buymeacoffee.com/gautric" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

## Installation

Either use the Menu - Manage palette option, or run the following command in your Node-RED user directory - typically ~/.node-red

```sh
# Using npm
npm install --save @gautric/node-red-ipinfo

# Using yarn
yarn add @gautric/node-red-ipinfo
```

## Configuration 

* Node 
    * `input`: `msg.payload`, Where to retrieve the IP address from the message
    * `output`: `msg.payload`, Where to put the result into the Node-RED flow
    * `name`: Name of the node instance
    * `config`: `IPInfo Config` 


* IPInfo Config
    * `name`: Name of the node configuration instance
    * `token`: [Your Token](https://ipinfo.io/account/token) for calling the [IPInfo](https://ipinfo.io) service
    * `timeout`: `1000` ms, Timeout for the request 
    * `cacheEnabled`: `true`/`false`, Enable or disable cache to improve performance and reduce cost
    * `maxitem`: `5000`, maximum number of items in the cache
    * `ttl`: `24 * 1000 * 60 * 60` ms, Time To Live (TTL) of items in the cache

## Example

![Screenshot](https://raw.githubusercontent.com/gautric/node-red-ipinfo/refs/heads/main/images/Screenshoot.png)

## Get Help

[For bug reports and feature requests, open issues.](https://github.com/gautric/node-red-ipinfo/issues)
