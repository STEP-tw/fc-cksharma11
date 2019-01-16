const fs = require('fs');

const displayLog = function(req, res) {
  console.log(req.method, req.url);
};

const getFilePath = function(url) {
  if (url == '/') return './index.html';
  return '.' + url;
};

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const app = (req, res) => {
  displayLog(req, res);
  const path = getFilePath(req.url);
  fs.readFile(path, (err, data) => {
    if (err) return send(res, 404, 'Page not found');
    send(res, 200, data);
  });
};

module.exports = app;
