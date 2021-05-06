const fs = require('fs');
const axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let currentDate = new Date(Date.now()).toDateString();
  fs.access(`./public/images/${currentDate}.jpg`, (err) => {
    if (err) {
      axios({
        url: 'https://picsum.photos/480',
        method: 'GET',
        responseType: 'stream'
    }).then(response => {
      response.data.pipe(fs.createWriteStream(`./public/images/${currentDate}.jpg`));
      res.render('index', { title: 'Express', imageUrl: `/images/${currentDate}.jpg` });
      }).catch((err) => {
        throw err;
      })
    } else {
      res.render('index', { title: 'Express', imageUrl: `/images/${currentDate}.jpg` });
    }
  });



  
});

module.exports = router;
