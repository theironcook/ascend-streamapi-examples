const config = require('config');
const axios = require('axios');
const qs = require('qs');

// In my local dev / testing I don't like having to update the values in index.js
const getConfig = (key, specified) => {
  if(specified && ! specified.startsWith('REPLACE_WITH_')){
    return specified;
  }
  else if(config.has(key)) {
    return config.get(key);
  }
  else {
    throw `Error, tried to get a config value with key=${key} and a value of ${specified} and the value was missing`;
  }
};

const fetchAPIToken = async (apiTokenUrl, client_id, client_secret) => {
  const {data} = await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      client_id,
      client_secret
    }),
    url: apiTokenUrl,
    params: {
      'grant_type': 'client_credentials'
    }
  });

  // data will contain access_token and expires_in (seconds that the token will expire)
  return data;
}

module.exports = { getConfig, fetchAPIToken };