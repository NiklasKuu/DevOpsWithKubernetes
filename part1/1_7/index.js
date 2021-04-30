// This snippet is from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

const randomUUID = generateUUID();

const printUIID = async () => {
  setTimeout(() => {
    console.log(`${ new Date(Date.now()).toISOString()}: ${randomUUID}`);
    printUIID();
  }, 5000)
}

printUIID();

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(`${ new Date(Date.now()).toISOString()}: ${randomUUID}`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})