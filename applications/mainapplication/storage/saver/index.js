const fs = require('fs')

// This snippet is from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

const saveUIID = async () => {
  setTimeout(() => {
    saveToFile(`${ new Date(Date.now()).toISOString()}: ${randomUUID}`);
    saveUIID();
  }, 5000)
}

const saveToFile = async (text) => {
  fs.appendFile('./data/timestamps.txt', text + '\n', function(err){
    if (err){
      throw err;
    }
    console.log(`${text} saved to file data/timestamps.txt`);
  });
}  

//create directory if it does not exist
if (!fs.existsSync('./data')){
  fs.mkdirSync('./data');
}

const randomUUID = generateUUID();


saveUIID();



