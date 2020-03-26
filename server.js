const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const DataStore = require('./dataStore.js')
const dataTest = require('./test.js')
let myDataBase = new DataStore(`mongodb+srv://paulPhelps:paulPhelps@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority`, 'chat', 'movies')
//mongodb+srv://PaulPhelps:Btv%402019@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority

app.use(express.static(path.join(__dirname, '/chatter/build')));
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }))

app.get('/db', getEntries)

async function getEntries (req, res) {
    console.log('connecting?')
    let items = await myDataBase.getAll()
    res.type('application/json').send(JSON.stringify(items))
}

//async function insertDataOnce () {
//    await myDataBase.insertMany(dataTest)
//}

//insertDataOnce()
//
//async function showAllConsole () {
//    let testData = await myDataBase.getAll();
//    console.log(testData);
//}

//showAllConsole()
//insertDataOnce()

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/chatter/build/index.html'));
  });

app.listen(port, ()=>{console.log(`Listening on port: ${port}`)})

