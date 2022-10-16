# NEAR REST API SERVER

> Interact with the NEAR blockchain using a simple REST API.

## Requirements

- [NEAR Account](https://docs.near.org/concepts/basics/account) _(with access to private key or seed phrase)_
- [Node.js](https://nodejs.org/en/download/package-manager/)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- API request tool such as [Postman](https://www.postman.com/downloads/)

---

## Setup

1. Clone repository / move to server

```bash
git clone git@github.com:codestates/BTA1stProject-18.git
cd server
```

2. Install dependencies

```bash
npm install
```

3. Configure `near-api-server.config.json`

Default settings: testnet

```json
{
  "server_host": "localhost",
  "server_port": 8080,
  "rpc_node": "https://rpc.testnet.near.org",
  "init_disabled": true,
  "user": "public_readonly",
  "host": "testnet.db.explorer.indexer.near.dev",
  "database": "testnet_explorer",
  "password": "nearprotocol",
  "port": 5432
}
```

_**Note:** `init_disabled` determines if params can be changed via `/init` route._

4. Start server

```bash
npm start
```

---

