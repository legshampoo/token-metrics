require('dotenv').config()
const axios = require('axios');
const { DateTime } = require('luxon');
const dateFormat = require('dateformat');

const ETHERSCAN_API_KEY = 'WG3CNUR4BRCXMPPUWCWTGFV9X91KKCTRNW';

module.exports = {
  walletTransactions: async (req, res) => {
    console.log('Get Wallet Transactionz');
    console.log(req.body);
    const wallets = req.body;

    const wallet = wallets[0];
    const uri_tokenTx = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    const uri_normalTx = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    
    const tokenTxResult = await axios.get(uri_tokenTx);
    let transactions = tokenTxResult.data.result;
    console.log('token tx txns: ', transactions.length);

    const normalTxResult = await axios.get(uri_normalTx);
    // console.log(normalTxResult.data.result);
    const normalTransactions = normalTxResult.data.result;
    transactions.push(...normalTransactions);
    console.log('after normal: ', transactions.length);
    let txs = [];
    transactions.map(tx => {
      const timestamp = tx.timeStamp;
      const date = new Date(timestamp*1000);
      const dateFormatted = dateFormat(date, 'isoDateTime', true);
      
      tx.time = dateFormatted;

      // put the time and timestamp at the top of the object keys for readability in the sheet
      let objectOrder = {
        'time': null,
        'timeStamp': null,
        'blockNumber': null
      };

      const newTx = Object.assign(objectOrder, tx);
      // console.log(newTx);
      txs.push(newTx);
    })
    
    console.log(txs[0]);
    res.send(txs);
  },
  normalTransactions: async (req, res) => {
    console.log('Get Wallet Transactionz');
    console.log(req.body);
    const wallets = req.body;

    const wallet = wallets[0];
    const uri = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const result = await axios.get(uri);
    let transactions = result.data.result;
    console.log('txns: ', transactions);
    res.send(transactions);
  }
}