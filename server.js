const express = require('express');

//Instantiate Express: 
const app = express(); 

//Parse incoming string or array data 
app.use(express.urlendcoded({extended: false}));

//parse incoming JSON data 
app.use(express.json());

//Middleware that instructs server to make the public folder readily available. 
app.use(express.static('public'));







app.listen(3001, () => {
  console.log('You are live on port 3001!');
});