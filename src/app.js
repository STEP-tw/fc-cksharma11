const fs = require('fs');

const displayLog = function(req, res) {
  console.log(req.method, req.url);
};

const getFileName = function(url) {
  if (url == '/') return './index.html';
  return '.' + url;
};

const send = function(res, data) {
  res.statusCode = 200;
  res.write(data);
  res.end();
};

const sendNotFound = function(res) {
  res.statusCode = 404;
  res.end();
};

const app = (req, res) => {
  displayLog(req, res);
  const path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    if (!err) return send(res, data);
    return sendNotFound(res);
  });
};

module.exports = app;
