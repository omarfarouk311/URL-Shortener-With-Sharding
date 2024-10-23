const express = require('express');
const hr = require('hashring');
const { Client } = require('pg');
const crypto = require('crypto');

const hashring = new hr();

const clients = {
    shard1: new Client({
        "user": "postgres",
        "password": `${process.env.POSTGRES_PASSWORD}`,
        "host": "shard1",
        "port": 5432,
        "database": "postgres"
    }),
    shard2: new Client({
        "user": "postgres",
        "password": `${process.env.POSTGRES_PASSWORD}`,
        "host": "shard2",
        "port": 5432,
        "database": "postgres"
    }),
    shard3: new Client({
        "user": "postgres",
        "password": `${process.env.POSTGRES_PASSWORD}`,
        "host": "shard3",
        "port": 5432,
        "database": "postgres"
    })
}

const app = express();
app.use(express.json());

app.get('/:urlId', async (req, res) => {
    const { urlId: shortenedUrl } = req.params;
    const shard = hashring.get(shortenedUrl);

    try {
        const result = await clients[shard].query('SELECT URL FROM URL_TABLE WHERE URL_ID = $1', [shortenedUrl]);
        if (!result.rows.length) return res.sendStatus(404);

        const { url } = result.rows[0];
        return res.json({
            url,
            shortenedUrl,
            shard
        });
    }
    catch (err) {
        return res.sendStatus(500);
    }
});

app.post('/', async (req, res) => {
    const { url } = req.body;
    const shortenedUrl = crypto.createHash('sha256').update(url).digest("base64").substring(0, 6);
    const shard = hashring.get(shortenedUrl);

    try {
        await clients[shard].query('INSERT INTO URL_TABLE (URL,URL_ID) VALUES ($1,$2)', [url, shortenedUrl]);
        return res.json({
            url,
            shortenedUrl,
            shard
        });
    }
    catch (err) {
        return res.sendStatus(500);
    }
});

async function connect() {
    hashring.add("shard1");
    hashring.add("shard2");
    hashring.add("shard3");

    await Promise.all[clients.shard1.connect(), clients.shard2.connect(), clients.shard3.connect()];
}

setTimeout(async () => {
    try {
        await connect();
        app.listen(8080);
    }
    catch (err) {
        console.error(err);
    }
}, 3000);