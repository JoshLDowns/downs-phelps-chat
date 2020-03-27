const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const DataStore = require('./dataStore.js')
const dataTest = require('./test.js')
let myDataBase = new DataStore(`mongodb+srv://paulPhelps:paulPhelps@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority`, 'chat', 'test')

app.use(express.static(path.join(__dirname, '/chatter/build')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/db', getEntries)
app.post('/post', postEntry)

async function getEntries (req, res) {
    console.log('connecting?')
    let items = await myDataBase.getAll()
    res.type('application/json').send(JSON.stringify(items))
}

async function postEntry (req, res) {
  console.log('entering data...')
  let date= new Date().toDateString()
  let user = req.body.user
  let content  = req.body.content
  await myDataBase.insert({date:date, user:user, content:content})
  let items = await myDataBase.getAll()
  res.type('application/json').send(JSON.stringify(items))
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/chatter/build/index.html'));
  });

app.listen(port, ()=>{console.log(`Listening on port: ${port}`)})

