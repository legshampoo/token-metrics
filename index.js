const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const gecko = require('./routes/gecko');

app.use(logger);
app.use(express.json({ limit: '1mb' }));

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


app.listen(PORT, err => {

  if(err){
    return console.log('Error', err);
  }
  
  console.log(`Example app listening at http://localhost:${PORT}`)

});