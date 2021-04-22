'use strict';
const express = require('express');
const axios = require('axios');

let router = express.Router();

const coins = require('../config/coin-list.js');

const baseURI = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=';

router
  .route('/coins/markets')
  .get(async (req, res) => {
    // console.log(req.query);
    // const api_url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    // var api_url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=';
    var api_url = baseURI;
    
    coins.coinList.map((id, i) => {
      api_url += id + '%2C';
    })
    api_url += '&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    
    const response = await axios.get(api_url);
    const data = response.data;
    res.send(data);
  })
  .post(async (req, res) => {
    console.log('POST');
    var coinList = req.body;
    console.log(coinList);

    var api_url = baseURI;
    coinList.map((id, i) => {
      api_url += id + '%2C';
    })

    api_url += '&order=market_cap_desc&per_page=100&page=1&sparkline=false';

    const response = await axios.get(api_url);
    const data = response.data;
    res.send(data);
  });

// router
//   .route('/two/:id')
//   .get((req, res) => {
//     res.send('two get ' + req.params.id);
//   })
//   .put((req, res) => {
//     res.send('two put id: ', + req.params.id);
//   });

module.exports = router;