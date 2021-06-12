const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express')
const app = express()
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const port = 3001



// Create database connection
const connectionUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_URL}:5432/${process.env.DB_NAME}`
console.log(connectionUrl)
const sequelize = new Sequelize(connectionUrl)

//define db models
const db_todo = sequelize.define('todo', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// db_connection authentication function
const testDbConnection = async(db_instance) => {
  const MAXRETRY = 5; // how many times to retry connection before throwing error
  const TIME_BETWEEN_RETRY = 1000; // how long to wait after connection failure

  let retry_count = 0;
  let connection_success = false;
  while (!connection_success) {
      try {
          await db_instance.authenticate();
          console.log('Connection has been established successfully.');
          connection_success = true;
      } catch (error) {
          retry_count++;
          if (retry_count >= MAXRETRY) {
              console.error('Unable to connect to the database:', error);
              throw error;
          }
          console.log('Could not connect to database, reconnecting');
          await sleep(TIME_BETWEEN_RETRY);
      }
  }
  function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

//setup db with models
testDbConnection(sequelize).then(async () => {
  await sequelize.sync()
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/backend/static',express.static(path.join(__dirname, 'public')));
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


app.get('/backend/todos', cors(), async (req, res) => {
  const todos = (await db_todo.findAll()).map( x => x.text);
  res.send({todos: todos});
})


app.post('/backend/todos', cors(), async (req, res) => {
  const name = req.query.todoName;
  if (!name){
    return res.status(400).send('missing todoName parameter');
  }
  if(name.length <= 3) {
    return res.status(400).send('todo is too short, todoName <= 3')
  }
  if(name.length >= 140) {
    return res.status(400).send('todo is too long, todoName > 140')
  }

  const newTodo = await db_todo.create({
    text: name
  })
  const todos = (await db_todo.findAll()).map( x => x.text);
  res.send({todos: todos});
})

app.get('/backend/imageName', cors(), async (req, res, next) => {
  const imageName = await getImagePath(new Date(Date.now()).toDateString());
  res.send({imageName: imageName});
})

//for some reason this needs to be here, otherwise ingress wont allow requests to the backend, because it thinks its down
app.get('/', (req,res) => {
  res.status(200).send();
})
//for some reason this needs to be here, otherwise ingress wont allow requests to the backend, because it thinks its down
app.get('/backend', (req,res) => {
  res.status(200).send();
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