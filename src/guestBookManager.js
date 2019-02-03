const {
  UTF8,
  LOGIN_FORM_TEMPLATE,
  COMMENT_FORM_TEMPLATE,
  GUEST_BOOK_TEMPLATE,
  FORM_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  EMPTY_STRING
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

const getCommentsForm = function(req) {
  const name = EMPTY_STRING + req.headers.cookie.substr(16);
  const commentForm = COMMENT_FORM_HTML.replace(USERNAME_PLACEHOLDER, name);
  return GUEST_BOOK_HTML.replace(FORM_PLACEHOLDER, commentForm);
};

const getLoginForm = function() {
  return GUEST_BOOK_HTML.replace(FORM_PLACEHOLDER, LOGIN_FORM_HTML);
};

const serveGuestBookPage = function(req, res, next) {
  let guestBookPageHTML = getLoginForm();
  if (isUserLoggedIn(req)) {
    guestBookPageHTML = getCommentsForm(req);
  }
  res.send(guestBookPageHTML);
};

const doLogin = function(req, res) {
  const { name } = parseCommentDetails(req.body);
  loggedInUsers.push(name);
  res.setHeader('Set-Cookie', `username=${name}`);
  res.redirect('/guest_book.html');
};

const doLogout = function(req, res) {
  const { name } = parseCommentDetails(req.body);
  const expiryDate = 'Wed, 31 Oct 2012 08: 50: 17 GMT';
  res.setHeader('Set-Cookie', `username=${name}; expires=${expiryDate}`);
  res.redirect('/guest_book.html');
};

module.exports = {
  doLogin,
  serveGuestBookPage,
  doLogout
};
