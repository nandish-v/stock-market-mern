const axios = require('axios');

const BASE_URL = 'https://api.twelvedata.com';
const cache = new Map();
const TTL = 45 * 1000;

function key(endpoint, params) { return `${endpoint}:${JSON.stringify(params)}`; }
async function request(endpoint, params = {}, ttl = TTL) {
  if (!process.env.TWELVE_DATA_API_KEY) throw Object.assign(new Error('Market data API key is not configured'), { statusCode: 503 });
  const cacheKey = key(endpoint, params); const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;
  try {
    const { data } = await axios.get(`${BASE_URL}/${endpoint}`, { params: { ...params, apikey: process.env.TWELVE_DATA_API_KEY }, timeout: 10000 });
    if (data.status === 'error' || data.code) throw Object.assign(new Error(data.message || 'Market data provider error'), { statusCode: 502 });
    cache.set(cacheKey, { value: data, expires: Date.now() + ttl });
    return data;
  } catch (error) {
    if (error.statusCode) throw error;
    if (error.response?.data?.message) throw Object.assign(new Error(error.response.data.message), { statusCode: 502 });
    throw Object.assign(new Error('Market data provider timed out'), { statusCode: 504 });
  }
}

const quote = (symbol) => request('quote', { symbol: symbol.toUpperCase() });
const history = (symbol, interval = '1day', outputsize = 30) => request('time_series', { symbol: symbol.toUpperCase(), interval, outputsize, order: 'ASC' }, 5 * 60 * 1000);
const search = (query) => request('symbol_search', { symbol: query }, 10 * 60 * 1000);
async function movers(direction) {
  // Twelve Data's market movers endpoint may vary by plan; this keeps the provider call server-side.
  return request('market_movers', { direction, country: 'India' }, 60 * 1000);
}
module.exports = { quote, history, search, movers };
