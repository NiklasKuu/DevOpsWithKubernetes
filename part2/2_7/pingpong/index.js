require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express')
const app = express()
const port = 3001




// Create database connection
const connectionUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_URL}:5432/${process.env.DB_NAME}`
const sequelize = new Sequelize(connectionUrl)
/*
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.DB_HOST_URL,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
  }
)*/
const db_counter = sequelize.define('counter', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER
  }
});

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
const setupCounter = async () => {
  let counter = -1;
  // get previous countervalue from db or create entity in db
  const query = await db_counter.findOne({
    where: { name: 'pingpong' }
  });
  if (!query){
    db_counter.create({
      name: 'pingpong',
      count: counter
    })
  } else {
    counter = query.dataValues.count;
  }
  return counter;
}
let counter;
testDbConnection(sequelize).then(async () => {
  await sequelize.sync()
  counter = await setupCounter();
});


app.get('/count',(req,res) => {
  res.send(`${counter}`);
})

app.get('/', async (req, res) => {
  counter++;
  res.send(`${counter}`);
  const updatedCounterCount = await db_counter.update(
    {
      count: counter
    },
    {
      where: { name: 'pingpong' }
    }
  )
  if (updatedCounterCount != 0){
    console.log('DB updated');
  } else {
    console.log('could not find entity');
  }
})

app.listen(port, () => {
  console.log(`Ping pong app listening at http://localhost:${port}`)
})