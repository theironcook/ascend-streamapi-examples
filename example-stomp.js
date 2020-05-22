const axios = require('axios');
const qs = require('qs');
const express = require('express');
const app = express();
const port = 3039; // change this if that port is already in use on your machine

app.use(express.static('.'));

app.get('/', (req, res) => res.redirect('example-stomp.html'));


// sandbox and prod
// const baseUrl = 'https://prod.hs1api.com';
// qa
const baseUrl = 'https://test.hs1api.com';

const apiTokenUrl = `${baseUrl}/oauth/client_credential/accesstoken`;


// You should expose your client_id and client_secret to a browser.
// Always fetch stream api access from your secure servers.
app.get('/stomp-creds', async (req, res, next) => {

  try {
    console.log(`client_id=${req.query.client_id} client_secret=${req.query.client_secret}`);
    const {data: {access_token}} = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({ 
        client_id: req.query.client_id,
        client_secret: req.query.client_secret
      }),
      url: apiTokenUrl,
      params: { 'grant_type': 'client_credentials' }
    });

    console.log(`access_token=${access_token}`);

    // Now use the existing rest api to fetch a new streaming api url for the stomp protocol with secure web sockets
    const {data} = await axios.get(`${baseUrl}/ascend-streaming-api/stomp-url`, {headers: {'Authorization': `Bearer ${access_token}`, 'Origin': 'localhost'}});    
    // data will contain: url, user, virtual-host

    return res.json(data);
  }
  catch(err){
    console.error(err);
    return next(err);
  }
});


app.listen(port, () => console.log(`Stomp example running on port ${port}! Open a browser to see it.`));