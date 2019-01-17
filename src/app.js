const fs = require('fs');
const Express = require('./express');
const app = new Express();

const HOME_DIR = './public_html';
const HOME_PAGE = '/index.html';
const ERROR_404 = 'Page not found';
const GUEST_BOOK_URL = './public_html/guest_book.html';
const COMMENTS_FILE = './data/comments.json';

const logRequest = function(req, res, next) {
  console.log(req.method, req.url);
  next();
};

const isHomePageRequest = url => url == '/';

const getFilePath = function(url) {
  if (isHomePageRequest(url)) return HOME_DIR + HOME_PAGE;
  return HOME_DIR + url;
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

const parse = function(comment) {
  let data = {};
  comment
    .split('&')
    .map(pair => pair.split('='))
    .map(([key, value]) => {
      data[key] = value.replace(/\+/g, ' ');
    });
  return data;
};

const createJSON = function(data) {
  const rawData = '[' + data.replace(/}{/g, '},{') + ']';
  return JSON.parse(rawData);
};

const createCommentsSection = function(guest_book, commentsJSON) {
  commentsJSON.map(comment => {
    guest_book += `<h3>${comment.date}:${comment.Name}:${comment.comment}</h3>`;
  });
  return guest_book;
};

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, 'UTF8', (err, guest_book) => {
    fs.readFile(COMMENTS_FILE, 'UTF8', (err, data) => {
      const json = createJSON(data);
      const pageWithComments = createCommentsSection(guest_book, json);
      send(res, 200, pageWithComments);
    });
  });
};

const saveComment = function(req, res) {
  const parsedComment = parse(req.body);
  parsedComment.date = new Date().toLocaleString();
  fs.appendFile(COMMENTS_FILE, JSON.stringify(parsedComment), err => {
    serveGuestBookPage(req, res);
  });
};

const readPostData = function(req, res, next) {
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', err => {
    req.body = data;
    next();
  });
};

app.use(logRequest);
app.use(readPostData);
app.get('/', serveFile);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
