const fs = require('fs');
const REDIRECTS = { '/': './public_html/index.html' };
const { HOME_DIR, NOT_FOUND_PAGE } = require('./constants');

const logRequest = function(req, res, next) {
  console.log(req.method, req.url);
  next();
};

const resolveRequestedFile = function(url) {
  return REDIRECTS[url] || HOME_DIR + url;
};

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const render404Page = function(req, res) {
  fs.readFile(NOT_FOUND_PAGE, (error, data) => {
    send(res, 404, data);
  });
};

const renderFile = function(req, res) {
  const filePath = resolveRequestedFile(req.url);
  fs.readFile(filePath, (error, data) => {
    if (error) return render404Page(req, res);
    send(res, 200, data);
  });
};

module.exports = {
  logRequest,
  send,
  render404Page,
  renderFile
};
