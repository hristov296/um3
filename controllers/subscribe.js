const config = require('./../config.json');
const request = require('request');

const client = config.clientid;
const secret = config.secret;
const subMode = 'subscribe';
const cbURL = 'http://exc3ssive29.localtunnel.me/handler';
const targetUser = config.myid;
const leaseDays = 10;
const leaseTime = leaseDays * 24 * 60 * 60;
const subURL = 'https://api.twitch.tv/helix/webhooks/hub';

request.debug = true;

let data = {
  'hub.mode': subMode,
  'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&from_id=${targetUser}`,
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
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info);
  } else {
    console.log('error: '+error);
  }
}

exports.send = function(req,res) {
  request(options,callback);
  res.send('subscription sent');
}