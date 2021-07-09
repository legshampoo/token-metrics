require('dotenv').config()
const axios = require('axios');
const web3 = require('web3');
const { DateTime } = require('luxon');
const dateFormat = require('dateformat');
const _ = require('lodash');
const BigNumber = require('bignumber.js');
const ethers = require('ethers');

const ETHERSCAN_API_KEY = 'WG3CNUR4BRCXMPPUWCWTGFV9X91KKCTRNW';

module.exports = {
  walletTransactions: async (req, res) => {
    console.log('Get Wallet Transactionz');
    console.log(req.body);
    const wallets = req.body;

    const wallet = wallets[0];
    const uri_tokenTransfer = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    const uri_normalTx = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const uri_internalTransactions = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    
    console.log('Getting transactions from Etherscan');
    const tokenTransferResult = await axios.get(uri_tokenTransfer);
    let tokenTransfers = tokenTransferResult.data.result;
    tokenTransfers.map(tx => {
      tx.type = 'TOKEN_TRANSFER';
    })
    // console.log(tokenTransfers);
    // console.log('token tx txns: ', transactions.length);

    const normalTxResult = await axios.get(uri_normalTx);
    let normalTransactions = normalTxResult.data.result;
    normalTransactions.map(tx => {
      tx.type = 'NORMAL';
    })

    const internalTransactionsResult = await axios.get(uri_internalTransactions);
    let internalTransactions = internalTransactionsResult.data.result;
    internalTransactions.map(tx => {
      tx.type = 'INTERNAL';
    })
    console.log('Data received');
    // console.log(internalTransactions);
    // transactions.push(...normalTransactions);
    // console.log('tok x: ', tokenTransfers.length);
    // console.log('norm: ', normalTransactions.length);
    // console.log('internal: ', internalTransactions.length);
    // const sum = tokenTransfers.length + normalTransactions.length + internalTransactions.length;
    // console.log('sum: ', sum);
    let transactions = tokenTransfers.concat(normalTransactions);
    transactions = transactions.concat(internalTransactions);
    // console.log('array length: ', transactions.length);
    // console.log('after normal: ', transactions.length);

    // console.log('first: ', transactions[0]);
    // console.log('last: ', transactions[transactions.length-1]);

    console.log('Formatting...');
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
        tokenName = 'Ethereum';
        tokenSymbol = 'ETH';
        tokenDecimal = 18;
        isError = tx.isError;
      }else {
        tokenName = tx.tokenName;
        tokenSymbol = tx.tokenSymbol.toUpperCase();
        tokenDecimal = parseInt(tx.tokenDecimal);
        isError = 'null';
      }

      
      let flow;
      if(tx.from.toUpperCase() === wallet.toUpperCase()){
        flow = 'OUT';
      }
      if(tx.to.toUpperCase() === wallet.toUpperCase()){
        flow = 'IN';
      }

      // console.log(tokenSymbol);
      const parse = ethers.utils.parseUnits(tx.value, 18-tokenDecimal);
      const valueEth = web3.utils.fromWei(parse.toString(), 'ether');

      // console.log('Value ETH: ', valueEth);
      
      let obj = {
        time: tx.time,
        timeStamp: tx.timeStamp,
        blockNumber: tx.blockNumber,
        contractAddress: tx.contractAddress,
        from: tx.from,
        to: tx.to,
        value: valueEth,
        flow: flow,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenDecimal: tokenDecimal,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        cumulativeGasUsed: tx.cumulativeGasUsed,
        confirmations: tx.confirmations,
        transactionIndex: tx.transactionIndex,
        type: tx.type
      }

      txns.push(obj);
    });

    // let txSorted = _.orderBy(txns, (o) => {
    //   return o.blockNumber
    // })
    console.log('Sorting...');
    let txSorted = _.orderBy(txns, ['blockNumber'], 'desc')
    
    // txSorted.map(tx => {
    //   console.log(tx.blockNumber);
    // })
    // console.log(txns[txns.length - 1]);
    
    res.send(txSorted);
    console.log('Done');
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