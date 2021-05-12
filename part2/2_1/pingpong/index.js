const fs = require('fs');
const axios = require('axios');
//create directory if it does not exist
if (!fs.existsSync('./data')){
  fs.mkdirSync('./data');
  console.log('creating folder ./data');
}


const express = require('express')
const app = express()
const port = 3001


let counter = -1;
if(fs.existsSync('./data/pongs.txt')){
  counter = parseInt(fs.readFileSync('./data/pongs.txt').toString());
}


app.get('/count',(req,res) => {
  res.send(`${counter}`);
})

app.get('/', (req, res) => {
  counter++;
  res.send(`${counter}`);
  fs.writeFileSync('./data/pongs.txt',counter.toString())
  console.log('added to file');
})



app.listen(port, () => {
  console.log(`Ping pong app listening at http://localhost:${port}`)
})