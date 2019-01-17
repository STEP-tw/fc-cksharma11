const fs = require('fs');
const Express = require('./express');
const app = new Express();

const ROOT = './public_html';
const HOME = '/index.html';
const ERROR_404 = 'Page not found';

const logRequest = function(req, res, next) {
  console.log(req.method, req.url);
  next();
};

const isHomePageRequest = url => url == '/';

const getFilePath = function(url) {
  if (isHomePageRequest(url)) return ROOT + HOME;
  return ROOT + url;
};

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const serveFile = function(req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, ERROR_404);
    send(res, 200, data);
  });
};

app.use(logRequest);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
