const config = require('./../config.json');
const request = require('request');
const twapi = require('./twitchapi');
const fs = require('fs');
request.debug = false;

exports.process = function(data) {
  if (typeof data !== undefined && data.length > 0) {
    dataObj = {}
    twapi.getgame(data[0].game_id).then(result => {
      dataObj.gameName = JSON.parse(result).data[0].name
      dataObj.gameThumb = JSON.parse(result).data[0].box_art_url.replace('{width}',config.game_box_art_width).replace('{height}',config.game_box_art_height);
      dataObj.title = data[0].title.replace(/"/g,'\"').replace(/\\/g,'\\\\');;
      dataObj.thumbnail_url = data[0].thumbnail_url.replace('{width}',config.thumbnail_preview_width).replace('{height}',config.thumbnail_preview_height);
      prepare_string(dataObj);
    });
  }
}

function prepare_string(dataObj) {
  fs.readFile('./../webhook.json', 'utf8', (err,data) => {
    if (err) throw err;
    do_request(JSON.stringify(JSON.parse(data)).replace(/<<<title>>>/g,dataObj.title).replace(/<<<gamename>>>/g,dataObj.gameName));
  })
}

function do_request(whcontstring) {
  options = {
    url: config.outerworld,
    body: whcontstring,
    headers: {
      'Content-type': 'application/json',
    }
  }
  request.post(options);
}