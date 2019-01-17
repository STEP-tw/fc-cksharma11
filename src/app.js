const fs = require('fs');
const Express = require('./express');
const app = new Express();

const HOME_DIR = './public_html';
const ERROR_404 = 'Page not found';
const GUEST_BOOK_URL = './public_html/guest_book.html';
const COMMENTS_FILE = './data/comments.json';
const REDIRECTS = { '/': './public_html/index.html' };
const UTF8 = 'UTF8';

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

const renderFile = function(req, res) {
  const filePath = resolveRequestedFile(req.url);
  fs.readFile(filePath, (error, data) => {
    if (error) return send(res, 404, ERROR_404);
    send(res, 200, data);
  });
};

const parseCommentDetails = function(comment) {
  const result = new Object();
  comment
    .split('&')
    .map(pair => pair.split('='))
    .map(([key, value]) => {
      result[key] = value.replace(/\+/g, ' ');
    });
  return result;
};

const createJSON = function(data) {
  const rawData = '[' + data.replace(/}{/g, '},{') + ']';
  return JSON.parse(rawData);
};

const createCommentsSection = function(guest_book, commentsJSON) {
  commentsJSON.forEach(comment => {
    guest_book += `<h4>${comment.date}:${comment.Name}:${comment.comment}</h4>`;
  });
  return guest_book;
};

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, UTF8, (error, guestBook) => {
    fs.readFile(COMMENTS_FILE, UTF8, (error, comments) => {
      const json = createJSON(comments);
      const guestBookWithComment = createCommentsSection(guestBook, json);
      send(res, 200, guestBookWithComment);
    });
  });
};

const saveComment = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date().toLocaleString();
  fs.appendFile(COMMENTS_FILE, JSON.stringify(commentDetails), error => {
    serveGuestBookPage(req, res);
  });
};

const readPostData = function(req, res, next) {
  const postData = { body: '' };
  req.on('data', chunk => (postData.body += chunk));
  req.on('end', error => {
    req.body = postData.body;
    next();
  });
};

app.use(logRequest);
app.use(readPostData);
app.get('/', renderFile);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
