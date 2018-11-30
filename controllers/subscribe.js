const config = require('./../config.json');
const request = require('request');

const client = config.clientid;
const secret = config.secret;
const subMode = 'subscribe';
const cbURL = 'https://um3.irithyll.com/handler';
const targetUser = config.myid;
const leaseDays = 10;
const leaseTime = leaseDays * 24 * 60 * 60;
const subURL = 'https://api.twitch.tv/helix/webhooks/hub';

request.debug = true;

let data = {
  'hub.mode': subMode,
  'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${targetUser}`,
  'hub.callback': cbURL,
  'hub.lease_seconds': leaseTime,
  'hub.secret': secret,
}
let dataString = JSON.stringify(data);

let options = {
  url: subURL,
  method: 'POST',
  body: dataString,
  headers: {
    'Content-type': 'application/json',
    'Client-ID': client,
  }
};

function callback(error, response, body) {
  body ? console.log(JSON.parse(body)) : '';
  error ? console.log(error) : '';
}

exports.send = function(req,res) {
  request(options,callback);
  res.send('subscription sent');
}