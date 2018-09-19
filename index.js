const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const subscribe = require('./controllers/subscribe');
const handler = require('./controllers/handler');

const port = process.env.PORT || 8080;
const app = express();

const logDir = path.join(__dirname, 'logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);

const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});

morgan.token('req-headers', function (req,res) {
  let value = '';
  Object.keys(req.headers).forEach(key => {
    value += `${key}: ${req.headers[key]}\n`;
  })
  return value;
});

morgan.token('req-body', function (req,res) {
  let value = '';
  if (typeof req.body !== undefined) {
    value = JSON.stringify(req.body);
  }
  return value;
});

morgan.token('req-msg', function (req,res) {
  if (req.umStatus) {
    return req.umStatus;
  }
});

app.use(bodyParser.json());
app.use(morgan(':date[clf] - :remote-addr :remote-user\n":method :url HTTP/:http-version" Status: :status; Referer: ":referrer"\n:req-headers\nRequest body: :req-body\nUM3 Message: :req-msg\n------------------------\n', {stream: accessLogStream}));

app.listen(port, function(){
  console.log(`Server is running on ${port}`);
});
app.get('/',(req,res)=>{
  res.send(`<h1>Hello world</h1>`);
});
app.get('/subscribe', subscribe.send);
app.get('/handler', handler.getRq );
app.post('/handler', handler.postRq);