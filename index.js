const express = require('express');
const app = express();
const port = process.env.port || 3000;
const gecko = require('./routes/gecko');

app.use(logger);
// app.use(express.json()); //if we want to accept json posts

app.use('/gecko', gecko);

app.get('/', (req, res) => {
  res.send('Hello Worldz!');
})

app.get('/users', (req, res) => {
  res.send('Users Page');
})

function logger(req, res, next) {
  console.log('Log: ', Date.now());
  next();
}

function auth(req, res, next) {
  console.log('Auth');
  next();
}

app.listen(port, err => {

  if(err){
    return console.log('Error', err);
  }
  
  console.log(`Example app listening at http://localhost:${port}`)

});