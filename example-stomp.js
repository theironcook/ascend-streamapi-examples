const axios = require('axios');
const express = require('express');
const app = express();
const { fetchAPIToken } = require('./helpers.js');

const port = 3039; // change this if that port is already in use on your machine

const _ = require('lodash');

app.use(express.static('.'));

app.get('/', (req, res) => res.redirect('example-stomp.html'));


// Example runs in prod / sandbox by default but possible to override to run in QA
let baseUrl = 'https://prod.hs1api.com';

const args = process.argv.slice(2);

if(args.length > 0 && args[0] === 'qa'){
  console.log('Running in qa');
  baseUrl = 'https://test.hs1api.com';
}

const apiTokenUrl = `${baseUrl}/oauth/client_credential/accesstoken`;


// You should never expose your client_id and client_secret to a browser.
// Always fetch stream api access from your secure servers.
app.get('/stomp-creds', async (req, res, next) => {

  try {
    console.log(`client_id=${req.query.client_id} client_secret=${req.query.client_secret}`);    
    const {access_token} = await fetchAPIToken(apiTokenUrl, req.query.client_id, req.query.client_secret);

    console.log(`access_token=${access_token}`);
    
    // Now use the existing rest api to fetch a new streaming api url for the stomp protocol with secure web sockets
    const {data} = await axios.get(`${baseUrl}/ascend-streaming-api/stomp-url`, {headers: {'Authorization': `Bearer ${access_token}`, 'Origin': 'localhost'}});

    return res.json(data);
  }
  catch(err){
    console.error(err);
    return next(err);
  }
});


// This is just a convenience to fetch the Organizations that your client_id has access to
app.get('/available-organizations', async (req, res, next) => {

  try {
    // Normally you should cache/reuse api tokens instead of refetching them
    const {access_token} = await fetchAPIToken(apiTokenUrl, req.query.client_id, req.query.client_secret);
    
    // Now fetch the orgs your client_id has access to
    const {data: {organizations: orgIds}} = await axios.get(`${baseUrl}/orgmapper/LinkedOrgs`, {headers: {'Authorization': `Bearer ${access_token}`}});
    // Right now, organizations is an array of organization ids that your client_id has access to    
    const orgsWithNames = {};
    orgIds.map(orgId => orgsWithNames[orgId] = {});

    const waitPromises = [];
    // fetch the organization names in parallel - hopefully less than 1k
    // The LinkedOrgs endpoint only returns the org ids - you need to use the normal API to get the organization names
    // Normally you would probably keep this type of information cached in your own system and not refetch it all of the time
    for(let orgIdCount = 0; orgIdCount < orgIds.length; orgIdCount++){
      const orgId = orgIds[orgIdCount];
      waitPromises.push(new Promise(async (resolve, reject) => {
        try {
          const {data: {data}} = await axios.get(`${baseUrl}/ascend-gateway/api/v0/organizations`, 
                                          {headers: {'Authorization': `Bearer ${access_token}`, 'Organization-ID': orgId}});          
          orgsWithNames[orgId] = {name: data[0].name};
          resolve();
        }
        catch(err){
          console.error('Failed to fetch organization name', err);
          reject(err);
        }
      }));
    }

    try {
      // Run all promises in parallel but wait for the last one to finish
      await Promise.all(waitPromises);
    }
    catch(err){
      console.error('Failed to load organization names');
    }

    return res.json(orgsWithNames);
  }
  catch(err){
    console.error(err);
    return next(err);
  }
});


app.listen(port, () => console.log(`Stomp example running on port ${port}! Open a browser to see it.`));
