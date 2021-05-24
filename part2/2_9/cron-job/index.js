const axios = require('axios');
require('dotenv').config();
const url = process.env.TODO_URL
const port = process.env.TODO_PORT
const todoCreationUrl = `http://${url}:${port}/todos`
console.log(todoCreationUrl)



axios({
    url: 'https://en.wikipedia.org/wiki/Special:Random',
    method: 'GET',
    responseType: 'text'
}).then(response => {
    const todoString = response.request.res.responseUrl
    console.log('Random url fetched:', todoString);
    axios({
        url: `${todoCreationUrl}?todoName=Read ${todoString}`,
        method: 'POST',
        responseType: 'json'
    }).then((response)=>{
        console.log('Todo successfully created')
        console.log(response.data.todos);
    }).catch(err => {console.log(err); throw err})
}).catch( err => {throw err})