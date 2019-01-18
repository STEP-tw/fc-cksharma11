const fs = require('fs');
const Express = require('./express');
const app = new Express();

const {
  parseCommentDetails,
  createCommentsSection
} = require('./serverUtils');

const { GUEST_BOOK_URL, COMMENTS_FILE, UTF8 } = require('./constants');

const { logRequest, send, renderFile } = require('./appHelper');

const getComments = function() {
  const comments = fs.readFileSync(COMMENTS_FILE, UTF8);
  return JSON.parse(comments);
};

const comments = getComments();

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, UTF8, (error, guestBook) => {
    console.log(comments);
    const commentsData = comments.map(createCommentsSection);
    const commentsHTML = guestBook + commentsData.join('\n');
    send(res, 200, commentsHTML);
  });
};

const saveComment = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date().toLocaleString();
  comments.unshift(commentDetails);
  fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), error => {
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
