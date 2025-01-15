# IP Info - Node Red 

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
    * `input` : `msg.payload`, Where retrieve the IP adress from the message
    * `output` : `msg.payload`, Where put the result into the node-red image
    * `name` : Name of the instance node 
    * `config` : `IPInfo Config` 


* IPInfo Config
    * `name`: Name of the instance node configuration
    * `token`: [Your Token](https://ipinfo.io/account/token) for calling [IPInfo](https://ipinfo.io) service
    * `timeout`: `1000` ms, Timeout of the request 
    * `cacheEnabled`: `true`/`false`, Enable or disable cache to improve perf and reduce cost
    * `maxitem`: `5000`, number max of item into the cache
    * `ttl`: `24 * 1000 * 60 * 60` ms, Time To Leave of the item inside the cache

## Example

![Screenshot](images/Screenshoot.png)

## Get Help

[For bug reports and feature requests, open issues.](https://github.com/gautric/node-red-ipinfo/issues)
