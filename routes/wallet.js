require('dotenv').config()
const axios = require('axios');
const web3 = require('web3');
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
    const normalTransactions = normalTxResult.data.result;
    transactions.push(...normalTransactions);
    console.log('after normal: ', transactions.length);

    console.log('first: ', transactions[0]);
    console.log('last: ', transactions[transactions.length-1]);

    let txns = [];
    transactions.map(tx => {
      const timestamp = tx.timeStamp;
      const date = new Date(timestamp*1000);
      const dateFormatted = dateFormat(date, 'isoDateTime', true);
      
      tx.time = dateFormatted;

      // put the time and timestamp at the top of the object keys for readability in the sheet
      // let objectOrder = {
      //   'time': null,
      //   'timeStamp': null,
      //   'blockNumber': null
      // };

      // const newTx = Object.assign(objectOrder, tx);

      let tokenName;
      let tokenSymbol;
      let tokenDecimal;
      let isError;
      if(typeof tx.tokenName === 'undefined'){
        tokenName = 'null';
        tokenSymbol = 'null';
        tokenDecimal = 0;
        isError = tx.isError;
      }else {
        tokenName = tx.tokenName;
        tokenSymbol = tx.tokenSymbol;
        tokenDecimal = tx.tokenDecimal;
        isError = 'null';
      }

      let flow;
      if(tx.from.toUpperCase() === wallet.toUpperCase()){
        flow = 'OUT';
      }
      if(tx.to.toUpperCase() === wallet.toUpperCase()){
        flow = 'IN';
      }

      const value = web3.utils.fromWei(tx.value, 'ether');
      
      let obj = {
        time: tx.time,
        timeStamp: tx.timeStamp,
        blockNumber: tx.blockNumber,
        contractAddress: tx.contractAddress,
        from: tx.from,
        to: tx.to,
        value: value,
        flow: flow,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenDecimal: tokenDecimal,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        cumulativeGasUsed: tx.cumulativeGasUsed,
        confirmations: tx.confirmations,
        transactionIndex: tx.transactionIndex
      }

      txns.push(obj);
    })
    
    console.log(txns[0]);
    res.send(txns);
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