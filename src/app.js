const fs = require('fs');

const ROOT = './public_html';
const HOME = '/index.html';
const displayLog = function(req, res) {
  console.log(req.method, req.url);
};

const getFilePath = function(url) {
  if (url == '/') return ROOT + HOME;
  return ROOT + url;
};

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const handleRequest = function(req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Page not found');
    send(res, 200, data);
  });
};

const app = (req, res) => {
  displayLog(req, res);
  handleRequest(req, res);
};

module.exports = app;
