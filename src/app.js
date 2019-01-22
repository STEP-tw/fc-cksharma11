const Express = require('./express');
const app = new Express();
const Comment = require('./comments');
const comments = new Comment();
const { parseCommentDetails } = require('./serverUtils');
const { EMPTY_STRING } = require('./constants');
const { logRequest, send, renderFile } = require('./appHelper');
const { doLogin, serveGuestBookPage, doLogout } = require('./guestBookManager');

const loadUserComments = () => comments.readComments();

const getLoggedInUser = function(req) {
  return EMPTY_STRING + req.headers.cookie.substr(16);
};

const saveComment = function(req, res) {
  const comment = unescape(req.body.split('=')[1]);
  const date = new Date();
  const name = getLoggedInUser(req);
  comments.addComment({ date, name, comment });
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
  send(res, 200, JSON.stringify(comments.userComments));
};

loadUserComments();

app.use(logRequest);
app.use(readPostData);
app.get('/comments', commentsHandler);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.post('/login', doLogin);
app.post('/logout', doLogout);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
