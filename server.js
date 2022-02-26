const { createPool } = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "backendtest",
    connectionLimit: "1"
});

pool.query(`select * from user`, (err, result, fields) => {
    if(err){
        return console.log(err)
    }

    return console.log(result)
})

app.post('/user', (req, res) => {
    //pool.query(`insert into user values (${req.bod},${port},${port})`)

    res.send({
        message: `CREATE NEW USER: POST /user ${req.body}`,
        body: req.body
    });
});
