const fs = require('fs');
const Express = require('./express');
const app = new Express();
const Comment = require('./comments');
const comment = new Comment();
const COMMENTS_AREA = '####TO_BE_REPLACED_WITH_COMMENTS####';
const { parseCommentDetails, createCommentsSection } = require('./serverUtils');

const { GUEST_BOOK_URL, UTF8, NEW_LINE } = require('./constants');

const { logRequest, send, renderFile } = require('./appHelper');

const loadUserComments = () => comment.readComments();

const createCommentHTML = function(guestBook, comments) {
  return guestBook.replace(COMMENTS_AREA, comments.join(NEW_LINE));
};

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, UTF8, (error, guestBook) => {
    const commentsData = comment.userComments.map(createCommentsSection);
    const commentsHTML = createCommentHTML(guestBook, commentsData);
    send(res, 200, commentsHTML);
  });
};

const saveComment = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date().toLocaleString();
  comment.addComment(commentDetails);
  serveGuestBookPage(req, res);
};

const readPostData = function(req, res, next) {
  const postData = { body: '' };
  req.on('data', chunk => (postData.body += chunk));
  req.on('end', error => {
    req.body = postData.body;
    next();
  });
};

loadUserComments();

app.use(logRequest);
app.use(readPostData);
app.get('/', renderFile);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
