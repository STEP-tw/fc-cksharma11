const fs = require('fs');
const Express = require('./express');
const app = new Express();
const Comment = require('./comments');
const comment = new Comment();
const { parseCommentDetails } = require('./serverUtils');
const { EMPTY_STRING } = require('./constants');
const { logRequest, send, renderFile } = require('./appHelper');
const { doLogin, serveGuestBookPage } = require('./guestBookManager');

const loadUserComments = () => comment.readComments();

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
app.post('/login', doLogin);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
