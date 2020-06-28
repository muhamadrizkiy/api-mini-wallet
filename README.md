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

Then, load [http://localhost/](http://localhost/) on your browser.

And If you want to use the swagger you can go to [http://localhost/explorer](http://localhost/explorer) on your browser.

NOTE: This API using memory database, so if you restart the node js server, the data was clean up.


## API Documentation



### Init Wallet Account

Initial api to get an access_token.
1. Register a new user with the User.create() method, inherited from the generic PersistedModel object. See Registering users for more information.
```
{
  username: 'ea0212d3-abd6-406f-8c67-868e814a2436',
  password: '$2a$10$/VaUTPSom17ziZEBA90mtucn9kaQuwSVTqtkrJ8ILZuucXw71n4h6',
  email: 'muhamadrizkiy@gmail.com',
  id: 1
}
```
2. Log in a user by calling User.login() to get an access token. See Logging in users for more information.
```
{
  ttl: 1209600,
  userId: 1,
  created: 2020-06-28T15:15:37.168Z,
  id: 'VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl'
}
```
The id is a access_token, so we get the access_token from above.


Request
```
curl --location --request POST 'http://localhost/api/v1/init' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'customer_xid=ea0212d3-abd6-406f-8c67-868e814a2436'
```
Response
```
{
    "status": "Success",
    "data": {
        "token": "VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl"
    }
}
```


### Enable Wallet


Request
```
curl --location --request POST 'http://localhost/api/v1/wallet' \
--header 'Authorization: NgJpzmRAwx7pw5bAnjhSSPSPQIVufFHygtV5XZBh1lqz6k7juCvXZsDBQU5AgyLB'
```
Response
```
{
    "status": "Success",
    "data": {
        "wallet": {
            "id": "0373edc043a28dbaaf1a17898380624b",
            "owned_by": 1,
            "status": "enabled",
            "enable_at": "2020-06-28T15:19:48.144Z",
            "balance": 0
        }
    }
}
```

NOTE : Before enabling the wallet, the customer cannot view, add, or use its virtual money

```
{
    "status": "Fail",
    "data": {
        "error": true,
        "message": "Please Enable Your Wallet!"
    }
}
```



### Get wallet balance


Request
```
curl --location --request GET 'http://localhost/api/v1/wallet' \
--header 'Authorization: VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl'
```
Response
```
{
    "status": "Success",
    "data": {
        "wallet": {
            "id": "0373edc043a28dbaaf1a17898380624b",
            "owned_by": 1,
            "status": "enabled",
            "enable_at": "2020-06-28T15:19:48.144Z",
            "balance": 0
        }
    }
}
```


### Deposit


Request
```
curl --location --request POST 'http://localhost/api/v1/wallet/deposits' \
--header 'Authorization: VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'amount=100000' \
--data-urlencode 'reference_id=50535246-dcb2-4929-8cc9-004ea06f5241'
```
Response
```
{
    "status": "Success",
    "data": {
        "deposit": {
            "id": "a6dc22d8980bfeffaf832362689a1641",
            "deposited_by": 1,
            "status": "success",
            "deposited_at": "2020-06-28T15:15:33.536Z",
            "amount": 100000,
            "reference_id": "50535246-dcb2-4929-8cc9-004ea06f5241"
        }
    }
}
```


### Withdrawal


Request
```
curl --location --request POST 'http://localhost/api/v1/wallet/withdrawals' \
--header 'Authorization: VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'amount=60000' \
--data-urlencode 'reference_id=4b01c9bb-3acd-47dc-87db-d9ac483d20b2'
```
Response
```
{
    "status": "Success",
    "data": {
        "withdrawl": {
            "id": "0a02371d4338fd6181fc55cfc2ca73f2",
            "withdrawn_by": 1,
            "status": "success",
            "withdrawn_at": "2020-06-28T15:15:33.536Z",
            "amount": 60000,
            "reference_id": "4b01c9bb-3acd-47dc-87db-d9ac483d20b2"
        }
    }
}
```

And if the amount more than the current balance

```
{
    "status": "Fail",
    "data": {
        "error": true,
        "message": "The amount being used must not be more than the current balance."
    }
}
```


### Disable wallet


Request
```
curl --location --request PATCH 'http://localhost/api/v1/wallet' \
--header 'Authorization: VrbRVw9ZyEvLSGegZzuKG2zRluzWzTKDRVpzepblRiO44nDNA1RLAHJgvsvvnXLl' \
--form 'is_disabled=true'
```
Response
```
{
    "status": "Success",
    "data": {
        "wallet": {
            "id": "0373edc043a28dbaaf1a17898380624b",
            "owned_by": 1,
            "status": "disabled",
            "disabled_at": "2020-06-28T15:15:33.536Z",
            "balance": 40000
        }
    }
}
```

NOTE : If the wallet disabled, you cannot to view, add, or use its virtual money.

```
{
    "status": "Fail",
    "data": {
        "error": true,
        "message": "Please Enable Your Wallet!"
    }
}
```




