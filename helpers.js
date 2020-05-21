const config = require('config');

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

module.exports = { getConfig };