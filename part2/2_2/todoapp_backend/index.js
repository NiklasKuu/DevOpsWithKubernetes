const fs = require('fs');
const axios = require('axios');
const express = require('express')
const app = express()
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const port = 3001

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

const getImagePath = (currentDate) => {
  return new Promise(resolve => {
    fs.access(`./public/images/${currentDate}.jpg`, (err) => {
      if (err) {
        axios({
          url: 'https://picsum.photos/480',
          method: 'GET',
          responseType: 'stream'
      }).then(response => {
        response.data.pipe(fs.createWriteStream(`./public/images/${currentDate}.jpg`));
        resolve(`${currentDate}.jpg`);
        }).catch((err) => {
          throw err;
        })
      } else {
        resolve(`${currentDate}.jpg`);
      }
    });
  });
};


let todos = [];

app.get('/todos', cors(), (req, res) => {
  res.send({todos: todos});
})
app.post('/todos', cors(), (req, res) => {
  const name = req.query.todoName;
  if (!name){
    return res.status(400).send('missing todoName parameter');
  }
  todos = [...todos, name];
  res.send({todos: todos});
})
app.get('/imageName', cors(), async (req, res, next) => {
  const imageName = await getImagePath(new Date(Date.now()).toDateString());
  res.send({imageName: imageName});
})

// error handler
app.use(cors(), function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error: err});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})