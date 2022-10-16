'use strict';
const user = require('./controllers/user');
const blockchain = require('./controllers/blockchain');
const api = require('./api');
const faker = require('faker');
const crypto = require('crypto');
const CatboxMemory = require('@hapi/catbox-memory');
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const {Client, Pool} = require('pg');
Client.poolSize = 10000;
Pool.poolSize = 10000;

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, 'utf8'));
const ViewCacheExpirationInSeconds = 10;
const ViewGenerateTimeoutInSeconds = 30;

const init = async () => {
    const server = Hapi.server({
        port: settings.server_port,
        host: settings.server_host,
        "routes": {
            "cors": true
        },
        cache: [
            {
                name: 'near-api-cache',
                provider: {
                    constructor: CatboxMemory
                }
            }
        ]
    });

    function processRequest(request) {
        Object.keys(request.payload).map((key) => {
            switch (request.payload[key]) {
                case '{username}':
                    request.payload[key] = faker.internet
                        .userName()
                        .replace(/[^0-9a-z]/gi, '');
                    break;
                case '{color}':
                    request.payload[key] = faker.internet.color();
                    break;
                case '{number}':
                    request.payload[key] = faker.random.number();
                    break;
                case '{word}':
                    request.payload[key] = faker.random.word();
                    break;
                case '{words}':
                    request.payload[key] = faker.random.words();
                    break;
                case '{image}':
                    request.payload[key] = faker.random.image();
                    break;
            }
        });

        return request;
    }

    server.route({
        method: 'GET',
        path: '/accountID',
        handler: async (request) => {
            const publicKey = request.query.publicKey;
           
            if(publicKey === undefined || !publicKey) {
                return api.reject('퍼블릭키가 없습니다.');
            }
           
            const user = settings.user;
            const host = settings.host;
            const database = settings.database;
            const password = settings.password;
            const port = settings.port;
            const query = 'SELECT * FROM access_keys WHERE public_key = $1 ORDER BY last_update_block_height';
          
            let parameters = [];
            parameters.push(publicKey);
            console.log(parameters);
            const pool = new Pool({
                user,
                host,
                database,
                password,
                port,
            });

            try {
                //client.end();
                //client.connect();
                //let response = await client.query(query, parameters);
               
                pool.connect();
                let response = await pool.query(query, parameters);

                let data = response.rows;
                console.log(data[0]);

                pool.end();
                //client.end();

                return data[0];

                // promise - checkout a client
                /* pool.connect()
                .then(client => {
                    client.query(query, parameters) 
                    .then(res => {
                        client.release()
                        console.log(res.rows[0]) 
                        data = res.rows;
                        return data;
                    })
                    .catch(e => {
                        client.release()
                        console.log(err.stack)
                    })
                }) */

               /*  client.connect()
                client.query(query, parameters) // your query string here
                .then(result => data = result.rows) // your callback here
                .catch(e => console.error(e.stack)) // your callback here
                .then(() => client.end()) */

                /* let data = response.rows;
                console.log(data[0]);
                //client.release();
                client.end(); */

                //return data;
            } catch (ex) {
                return api.reject('Error: ' + ex.message);
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/explorer',
        handler: async (request) => {
            const accountId = request.query.accountId;
            if(accountId === undefined || !accountId) {
                return api.reject('계정 ID가 없습니다.');
            }
           
            const user = settings.user;
            const host = settings.host;
            const database = settings.database;
            const password = settings.password;
            const port = settings.port;
            const query = 'SELECT * FROM action_receipt_actions WHERE action_kind = $2 AND receipt_receiver_account_id = $1 LIMIT 5';
          
            let parameters = [];
            parameters.push(accountId);
            parameters.push('TRANSFER');
            console.log(parameters);
            const pool = new Pool({
                user,
                host,
                database,
                password,
                port,
            });

            try {
                pool.connect();
                let response = await pool.query(query, parameters);

                let data = response.rows;
                console.log(data[0]);

                pool.end();
                //client.end();
                return data;

            } catch (ex) {
                return api.reject('Error: ' + ex.message);
            }
        },
    });

    server.route({
        method: 'POST',
        path: '/view',
        handler: async (request, h) => {
            request = processRequest(request);

            if (request.payload.disabled_cache) {
                return blockchain.View(
                    request.payload.contract,
                    request.payload.method,
                    request.payload.params,
                    request.payload.rpc_node,
                    request.payload.headers
                );
            } else {
                request.payload.request_name = "view";
                return replyCachedValue(h, await server.methods.view(request.payload));
            }
        }
    });

    server.method(
        'view',
        async (params) => blockchain.View(
            params.contract,
            params.method,
            params.params,
            params.rpc_node,
            params.headers
        ),
        getServerMethodParams());

    server.route({
        method: 'POST',
        path: '/call',
        handler: async (request) => {
            request = processRequest(request);
            let {
                account_id,
                private_key,
                attached_tokens,
                attached_gas,
                contract,
                method,
                params,
                network,
                rpc_node,
                headers
            } = request.payload;
            return await blockchain.Call(
                account_id,
                private_key,
                attached_tokens,
                attached_gas,
                contract,
                method,
                params,
                network,
                rpc_node,
                headers
            );
        },
    });

    server.route({
        method: 'POST',
        path: '/init',
        handler: async (request) => {
            console.log(request);
            if (settings.init_disabled) {
                return api.reject('Method now allowed');
            }

            request = processRequest(request);
            let {
                master_account_id,
                seed_phrase,
                private_key,
                nft_contract,
                server_host,
                server_port,
                rpc_node,
            } = request.payload;

            if (seed_phrase)
                private_key = (await user.GetKeysFromSeedPhrase(seed_phrase)).secretKey;

            let response = await blockchain.Init(
                master_account_id,
                private_key,
                nft_contract,
                server_host,
                server_port,
                rpc_node
            );
            if (!response.error) {
                process.on('SIGINT', function () {
                    console.log('Stopping server...');
                    server.stop({timeout: 1000}).then(async function () {
                        await server.start();
                    });
                });
            }

            return response;
        },
    });

    server.route({
        method: 'POST',
        path: '/deploy',
        handler: async (request) => {
            request = processRequest(request);
            let {account_id, private_key, seed_phrase, contract} = request.payload;

            if (seed_phrase)
                private_key = (await user.GetKeysFromSeedPhrase(seed_phrase)).secretKey;

            return await blockchain.DeployContract(account_id, private_key, contract);
        },
    });

    server.route({
        method: 'POST',
        path: '/create_user',
        handler: async (request) => {
            request = processRequest(request);

            const name = (
                request.payload.name +
                '.' +
                settings.master_account_id
            ).toLowerCase();
            let account = await user.CreateKeyPair(name);

            let status = await user.CreateAccount(account);

            if (status)
                return {
                    text: `Account ${name} created. Public key: ${account.public_key}`,
                };
            else return {text: 'Error'};
        },
    });

    server.route({
        method: 'POST',
        path: '/parse_seed_phrase',
        handler: async (request) => {
            request = processRequest(request);

            return await user.GetKeysFromSeedPhrase(request.payload.seed_phrase);
        },
    });

    server.route({
        method: 'GET',
        path: '/balance/{account_id}',
        handler: async (request) => {
            return await blockchain.GetBalance(request.params.account_id);
        }
    });

    server.route({
        method: 'GET',
        path: '/keypair',
        handler: async () => {
            return await user.GenerateKeyPair();
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(-1);
});

const getServerMethodParams = () => {
    return {
        generateKey: (params) => {
            let hash = crypto.createHash('sha1');
            hash.update(JSON.stringify(params));
            return hash.digest('base64');
        },
        cache: {
            cache: 'near-api-cache',
            expiresIn: ViewCacheExpirationInSeconds * 1000,
            generateTimeout: ViewGenerateTimeoutInSeconds * 1000,
            getDecoratedValue: true
        }
    }
};

const replyCachedValue = (h, {value, cached}) => {
    const lastModified = cached ? new Date(cached.stored) : new Date();
    return h.response(value).header('Last-Modified', lastModified.toUTCString());
};

init();
