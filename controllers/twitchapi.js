const config = require('./../config.json');
const request = require('request');

exports.getgame = function (id,name) {
  let urlparam = '';
  if (id && name) {
    urlparam = ((Array.isArray(id)) ? `?id=${id.join('&id=')}` : `?id=${id}`);
    urlparam += ((Array.isArray(name)) ? `&name=${name.join('&name=')}` : `&name=${name}`);
  } else if (id) {
    urlparam = ((Array.isArray(id)) ? `?id=${id.join('&id=')}` : `?id=${id}`);
  } else if (name) {
    urlparam = ((Array.isArray(name)) ? `?name=${name.join('&name=')}` : `?name=${name}`);
  }
  
  options = {
    url: `https://api.twitch.tv/helix/games${urlparam}`,
    headers: {
      'Client-ID': config.clientid,
    }
  }

  return new Promise(function(resolve,reject) {
    request.get(options,function(err,res,body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}

exports.getuser = function(id,login) {
  let urlparam = '';
  if (id && login) {
    urlparam = ((Array.isArray(id)) ? `?id=${id.join('&id=')}` : `?id=${id}`);
    urlparam += ((Array.isArray(login)) ? `&login=${login.join('&login=')}` : `&login=${login}`);
  } else if (id) {
    urlparam = ((Array.isArray(id)) ? `?id=${id.join('&id=')}` : `?id=${id}`);
  } else if (login) {
    urlparam = ((Array.isArray(login)) ? `?login=${login.join('&login=')}` : `?login=${login}`);
  }

  options = {
    url: `https://api.twitch.tv/helix/users${urlparam}`,
    headers: {
      'Client-ID': config.clientid,
    }
  }

  return new Promise(function(resolve,reject) {
    request.get(options, function(err,res,body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}