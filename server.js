const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const DataStore = require('./dataStore.js')
//const dataTest = require('./test.js')
let myDataBase = new DataStore(`mongodb+srv://paulPhelps:paulPhelps@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority`, 'chat', 'test')

app.use(express.static(path.join(__dirname, '/chatter/build')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//I pass to here as a query param...
app.get('/db/:room', getEntries)
app.post('/post/:room', postEntry)

async function getEntries(req, res) {
  console.log(req.params.room)
  //which is parsed here and passed into databaseInstance
  let room = req.params.room
  let databaseInstance = new DataStore(`mongodb+srv://paulPhelps:paulPhelps@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority`, 'chat', `${room}`)
  let items = await databaseInstance.getAll()
  res.type('application/json').send(JSON.stringify(items))
  //which I close when I'm done, so we can open it again next time
  databaseInstance.dbClient.close()
}

async function postEntry(req, res) {
  //I do the same thing for postEntry
  console.log('entering data...')
  let date = new Date().toDateString()
  let time = new Date().toLocaleTimeString()
  let fullDate = `${date} @ ${time}`
  let user = req.body.user
  let content = req.body.content
  //assign room from params, passed from submit, and pass it into a different databaseInstance
  let room = req.params.room
  let databaseInstance = new DataStore(`mongodb+srv://paulPhelps:paulPhelps@chat-app-4tmuj.mongodb.net/test?retryWrites=true&w=majority`, 'chat', `${room}`)
  await databaseInstance.insert({ date: fullDate, user: user, content: content })
  let items = await myDataBase.getAll()
  res.type('application/json').send(JSON.stringify(items))
  //closin it out
  databaseInstance.dbClient.close()
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/chatter/build/index.html'));
});

app.listen(port, () => { console.log(`Listening on port: ${port}`) })

