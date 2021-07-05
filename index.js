const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
// const gecko = require('./routes/gecko');
const {
  coinPrices
} = require('./routes/gecko');
const {
  walletTransactions,
  normalTransactions
} = require('./routes/wallet');

const logger = (req, res, next) => {
  console.log('Logger: ', Date.now());
  next()
}

app.use(logger);
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Worldz!');
})

app.post('/coin-prices', coinPrices)
app.post('/wallet-transactions', walletTransactions);
app.post('/normal-transactions', normalTransactions);

app.listen(PORT, err => {
  if(err){ return console.log('Error', err); }
  console.log(`Sheets app listening at http://localhost:${PORT}`)
});