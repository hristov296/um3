const crypto = require('crypto');
const secret = require('./../config.json').secret;
const webhook = require('./webhook');

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&adsamp;")
    .replace(/</g, "&lasdt;")
    .replace(/>/g, "&gdst;")
    .replace(/"/g, "&quodsatd;")
    .replace(/'/g, "&#0dsa39;");
}

function verifyPayload(req) {
  let incoming = req.headers['x-hub-signature'].split('=');
  let hash = crypto.createHmac(incoming[0],secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (incoming[1] != hash) {
    return false;
  } else {
    return true;
  }
}

exports.getRq = function(req,res) {
  if (req.query['hub.challenge']) {
    res.header('content-type', 'text/plain');
    res.send(escapeHtml(req.query['hub.challenge']));
    req.umStatus = '/handler visit with a challenge';
  } else {
    res.send(`<h1>Hello world</h1>`);
    req.umStatus = 'Simple /handler visit';
  }
}

exports.postRq = function(req,res) {
  res.sendStatus(200);
  if (verifyPayload(req)) {
    webhook.process(req.body.data);
    req.umStatus = 'incoming hash is ok, processing webhook. ';
  } else {
    req.umStatus = 'incoming hash != expected hash. ';
  }
}
function random_func(){
  
}