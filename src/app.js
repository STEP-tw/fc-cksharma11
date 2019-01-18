const fs = require('fs');
const Express = require('./express');
const app = new Express();

const {
  parseCommentDetails,
  createJSON,
  createCommentsSection
} = require('./serverUtils');

const { GUEST_BOOK_URL, COMMENTS_FILE, UTF8 } = require('./constants');

const { logRequest, send, renderFile } = require('./appHelper');

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
