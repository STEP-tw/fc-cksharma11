const { send } = require('./appHelper');
const {
  UTF8,
  LOGIN_FORM_TEMPLATE,
  COMMENT_FORM_TEMPLATE,
  GUEST_BOOK_TEMPLATE,
  FORM_PLACEHOLDER
} = require('./constants');
const { parseCommentDetails } = require('./serverUtils');
const { splitKeyValue, assignKeyValue } = require('./serverUtils');
const fs = require('fs');

const loggedInUsers = [];

const readCookies = function(cookieHeader) {
  return cookieHeader
    .split('; ')
    .map(splitKeyValue)
    .reduce(assignKeyValue, {});
};

const isUserLoggedIn = function(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return false;
  }
  const cookies = readCookies(cookieHeader);
  return loggedInUsers.includes(cookies.username);
};

const LOGIN_FORM_HTML = fs.readFileSync(LOGIN_FORM_TEMPLATE, UTF8);
const COMMENT_FORM_HTML = fs.readFileSync(COMMENT_FORM_TEMPLATE, UTF8);
const GUEST_BOOK_HTML = fs.readFileSync(GUEST_BOOK_TEMPLATE, UTF8);

const getCommentsForm = function() {
  return GUEST_BOOK_HTML.replace(FORM_PLACEHOLDER, COMMENT_FORM_HTML);
};

const getLoginForm = function() {
  return GUEST_BOOK_HTML.replace(FORM_PLACEHOLDER, LOGIN_FORM_HTML);
};

const serveGuestBookPage = function(req, res, next) {
  let guestBookPageHTML = getLoginForm();
  if (isUserLoggedIn(req)) {
    guestBookPageHTML = getCommentsForm();
  }
  send(res, 200, guestBookPageHTML);
};

const doLogin = function(req, res) {
  const { name } = parseCommentDetails(req.body);
  loggedInUsers.push(name);
  res.setHeader('Set-Cookie', `username=${name}`);
  res.statusCode = 302;
  res.setHeader('location', '/guest_book.html');
  res.end();
};

module.exports = {
  doLogin,
  serveGuestBookPage
};
