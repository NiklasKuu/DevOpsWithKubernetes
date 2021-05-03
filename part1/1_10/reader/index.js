const fs = require('fs');


const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {

  fs.readFile('./data/timestamps.txt', function (err, data) {
    if (err) throw err;
    res.send(data.toString());
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})