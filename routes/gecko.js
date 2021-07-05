const axios = require('axios');

const coinGeckoBaseURI = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=';

module.exports = {
  coinPrices: async (req, res) => {
    console.log('POST: coin-prices');
    const coinList = req.body;
    
    let api_url = coinGeckoBaseURI;

    coinList.map((id, i) => {
      api_url += id + '%2C';
    })

    api_url += '&order=market_cap_desc&per_page=100&page=1&sparkline=false';

    const response = await axios.get(api_url);
    const data = response.data;

    res.send(data)
  }
}