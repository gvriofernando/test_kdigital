const { createPool } = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const crypto = require ("crypto");
const client = redis.createClient('redis://localhost:6379');

const app = express();
const port = process.env.PORT || 5000;

//const rateCheck = require('./ratelimiter'); // the rate limiter make this error, so i comment it

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

//app.use(rateCheck);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

app.use(bodyParser.json());

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "backendtest",
    connectionLimit: "1"
});

app.post('/user', (req, res) => {
    res.send({
        message: `CREATE NEW USER: POST /user`,
        body: req.body
    });

    let password = req.body.param2;
    let encryptedData = cipher.update(password, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    pool.query(`insert into user values ("${req.body.param1}","${encryptedData}","${req.body.param3}")`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
    })
});

app.get('/user/:username', (req, res) => {
    
    pool.query(`select * from user where username = "${req.params.username}"`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }

        return res.send(result);
    })
});

app.get('/sync/:words', (req, res) => {
    let hashed = cipher.update(req.params.words, "utf-8", "hex");
    hashed += cipher.final("hex");
    return res.send(hashed);
})

app.get('/async/:words', async (req, res) => {
    let hashed = cipher.update(req.params.words, "utf-8", "hex");
    hashed += cipher.final("hex");
    return res.send(hashed);
})

app.put('/user/:username&:hakakses', function (req, res) {
    pool.query(`update user set hakakses = "${req.params.hakakses}" where username = "${req.params.username}"`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
    })

    pool.query(`select * from user where username = "${req.params.username}"`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }

        return res.send(result);
    })
}); 

app.delete('/user/:username', (req, res) => {
    pool.query(`delete from user where username = "${req.params.username}"`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
    })

    res.send('Username is deleted');
});