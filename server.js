const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./Develop/db/db.json');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// Creates a random UUID. V1 = timestamp V3 = namespace w/ MD5 v5= namespace w/SHA-1
uuidv4(); // 

//Instantiate Express: 
const app = express();
const PORT = process.env.PORT || 3001;

//parse incoming JSON data 
app.use(express.json({ limit: '1mb' }));

//Middleware that instructs server to make the public folder readily available. 
app.use(express.static('./Develop/public'));

//Serve index.html file 
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '/Develop/public/index.html'));
});

//Serve notes.html file 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/Develop/public/notes.html'));
});

// Create an array to store the notes into our database. 
let database = [];

// Create a function to handle pushing the note into the Database Array and writing it into the db.json file. Kept seperate from the app.post callback for readability  
function writeNoteInDataBase(data) {
  // Push the note into database Array: 
  database.push(data);

  fs.writeFileSync(
    path.join(__dirname, './Develop/db/db.json'),
    JSON.stringify({ db: database }, null, 2)
  );
  return data;
}

//Serve what is stored in the database to the client 
app.get('/api/notes', (req, res) => {
  res.json(database);
})


// Handle incoming fetch post with new note
app.post('/api/notes', (req, res) => {
  //set id based on what the next index of the array will be 
  req.body.id = uuidv4();
  // Store the body of the post simply as 'data' 
  const data = req.body;
  const newNote = writeNoteInDataBase(data);

  console.log(database);
  res.json({
    status: 'success!'
  })
})

// The colon after the route lets the endpoint know that what is coming is a PARAMETER being passed in
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  database = database.filter((database) => database.id != id);
  console.log("Delete request Called");
  res.send(`Note with id ${id} deleted.`);
});

app.listen(PORT, () => {
  console.log(`API server live on port ${PORT}!`);
});