require('dotenv').config()
const axios = require('axios');

const ETHERSCAN_API_KEY = 'WG3CNUR4BRCXMPPUWCWTGFV9X91KKCTRNW';

module.exports = {
  walletTransactions: async (req, res) => {
    console.log('Get Wallet Transactionz');
    console.log(req.body);
    const wallets = req.body;

    const wallet = wallets[0];
    const uri = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`

    const result = await axios.get(uri);
    const transactions = result.data.result;
    console.log(transactions);
    res.send(transactions);
  }
}