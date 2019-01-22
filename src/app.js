const fs = require('fs');
const Express = require('./express');
const app = new Express();
const Comment = require('./comments');
const comment = new Comment();
const { parseCommentDetails } = require('./serverUtils');

const { GUEST_BOOK_URL, UTF8, EMPTY_STRING } = require('./constants');

const { logRequest, send, renderFile } = require('./appHelper');

const loadUserComments = () => comment.readComments();

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, UTF8, (error, guestBook) => {
    send(res, 200, guestBook);
  });
};

const saveComment = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date();
  comment.addComment(commentDetails);
  serveGuestBookPage(req, res);
};

const readPostData = function(req, res, next) {
  let body = EMPTY_STRING;
  req.on('data', chunk => (body += chunk));
  req.on('end', error => {
    req.body = body;
    next();
  });
};

const commentsHandler = function(req, res) {
  send(res, 200, JSON.stringify(comment.userComments));
};

loadUserComments();

app.use(logRequest);
app.use(readPostData);
app.get('/comments', commentsHandler);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
