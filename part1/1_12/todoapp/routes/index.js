const fs = require('fs');
const axios = require('axios');
var express = require('express');
var router = express.Router();

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
        resolve(`/images/${currentDate}.jpg`);
        }).catch((err) => {
          throw err;
        })
      } else {
        resolve(`/images/${currentDate}.jpg`);
      }
    });
  });
};


/* GET home page. */
router.get('/', async function(req, res, next) {
  const currentDate = new Date(Date.now()).toDateString();
  const imagePath = await getImagePath(currentDate);
  res.render('index', { title: 'Express', imageUrl: imagePath });
  
});

module.exports = router;
