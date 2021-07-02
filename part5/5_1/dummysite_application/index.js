const axios = require('axios');
const fs = require('fs');
const express = require('express');
var path = require('path');
require('dotenv').config();
const url = process.env.WEBSITE_URL;

console.log(`cloning site: ${url}`);

axios({
    url: url,
    method: 'GET',
    responseType: 'text'
}).then(response => {
    console.log(response.data);
    fs.writeFile('./views/index.ejs', response.data, startServer);
}).catch( err => {
    throw err
});

const startServer = () => {
    const app = express();
    const port = 3003;
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    
    app.get('/', (req, res) => {
        res.render('index');
    })
    
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
} 