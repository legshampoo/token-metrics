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
    const uri = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`

    const result = await axios.get(uri);
    let transactions = result.data.result;
    console.log('txns: ', transactions.length);

    transactions.map(tx => {
      const timestamp = tx.timeStamp;
      console.log(timestamp);
      const date = new Date(timestamp*1000);
      const dateFormatted = dateFormat(date, 'isoDateTime', true);
      console.log(dateFormatted);
      tx.time = dateFormatted;
    })
    
    // const t = new Date(transactions[0].timeStamp).toString();
    // console.log(transactions[0].timeStamp)
    // const t = new Date(transactions[0].timestamp);
    
    // console.log(t.toString());
    res.send(transactions);
  }
}