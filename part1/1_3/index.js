// This snippet is from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

const randomUUID = generateUUID();
let nextPrint = 0;
while(true) {
    const time = Date.now()
    if (time >= nextPrint){
        console.log(`${ new Date(time).toISOString()}: ${randomUUID}`);
        nextPrint = time + 5000;
    }
}

