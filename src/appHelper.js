const fs = require('fs');
const REDIRECTS = { '/': './public_html/index.html' };
const { HOME_DIR, NOT_FOUND_PAGE } = require('./constants');

/**
 * Used to log request url and method
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @param {function} next to call next handler
 */

const logRequest = function(req, res, next) {
  console.log(req.method, req.url);
  next();
};

/**
 * used to get the request url
 * @param {string} url requested url
 */

const resolveRequestedFile = function(url) {
  return REDIRECTS[url] || HOME_DIR + url;
};

/**
 * used to send response to user with correct statu code
 * @param {Object} res http request object
 * @param {number} statusCode response code
 * @param {string} content response data
 */

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

/**
 * Used to deal with 404 page not found error
 * @param {Object} req http request object
 * @param {Object} res htttp response object
 */

const render404Page = function(req, res) {
  fs.readFile(NOT_FOUND_PAGE, (error, data) => {
    send(res, 404, data);
  });
};

/**
 * used to read and write the file to response object
 * @param {Object} req http request object
 * @param {Object } res http response object
 */

const renderFile = function(req, res) {
  const filePath = resolveRequestedFile(req.url);
  fs.readFile(filePath, (error, data) => {
    if (error) return render404Page(req, res);
    send(res, 200, data);
  });
};

/**
 * Exported methods
 */

module.exports = {
  logRequest,
  send,
  render404Page,
  renderFile
};
