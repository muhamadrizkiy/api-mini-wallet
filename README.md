# Mini Wallet API

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/strongloop/loopback?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Module LTS Adopted'](https://img.shields.io/badge/Module%20LTS-Adopted-brightgreen.svg?style=flat)](http://github.com/CloudNativeJS/ModuleLTS)
[![IBM Support](https://img.shields.io/badge/IBM%20Support-Frameworks-brightgreen.svg?style=flat)](http://ibm.biz/node-support)

## Overview

LoopBack is a highly-extensible, open-source Node.js framework that enables you to:

  * Create dynamic end-to-end REST APIs with little or no coding.
  * Access data from Oracle, MySQL, PostgreSQL, MS SQL Server, MongoDB, SOAP and other REST APIs.
  * Incorporate model relationships and access controls for complex APIs.
  * Use built-in push, geolocation, and file services for mobile apps.
  * Easily create client apps using Android, iOS, and JavaScript SDKs.
  * Run your application on-premises or in the cloud.

LoopBack consists of:

  * A library of Node.js modules.
  * [Yeoman](http://yeoman.io/) generators for scaffolding applications.
  * Client SDKs for iOS, Android, and web clients.

LoopBack tools include:
  * Command-line tool `loopback-cli` to create applications, models, data sources, and so on.

For more details, see [https://loopback.io/](https://loopback.io/).

## Setup

To preview the website locally:

1.  Install [Node.js](https://nodejs.org/en/) if you don't have them already.

2.  Clone this repo (you might use the SSH URL instead of HTTPS).:

```
git clone https://github.com/muhamadrizkiy/api-mini-wallet.git
```

3.  `cd` to the repository directory and run the following command:

```
$ cd api-mini-wallet
$ npm install
```

## Run and view swagger locally

Run Loopback using the following command:

```
$ node .
```

Then, load [http://localhost:3000/](http://localhost:3000/) on your browser.

And If you want to use the swagger you can go to [http://localhost:3000/explorer](http://localhost:3000/explorer) on your browser.

NOTE: This API using memory database, so if you restart the node js server, the data was clean up.
