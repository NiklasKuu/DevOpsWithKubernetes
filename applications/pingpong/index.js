const express = require('express')
const app = express()
const port = 3001

let counter = -1;

app.get('/', (req, res) => {
  counter++;
  res.send(`pong ${counter}`);
})

app.listen(port, () => {
  console.log(`Ping pong app listening at http://localhost:${port}`)
})