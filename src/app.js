const fs = require('fs');
const Express = require('./express');
const app = new Express();
const Comment = require('./comments');
const comment = new Comment();
const COMMENTS_AREA = '####TO_BE_REPLACED_WITH_COMMENTS####';
const { parseCommentDetails, createCommentsSection } = require('./serverUtils');

const { GUEST_BOOK_URL, UTF8, NEW_LINE } = require('./constants');

const { logRequest, send, renderFile } = require('./appHelper');

/**
 * Its using instance of comment class
 */

const loadUserComments = () => comment.readComments();

/**
 * Its simply used to create HTML by adding gestBook.html and comments
 * @param {string} guestBook guestBook.html
 * @param {Object} comments nothing but just comments in json format
 */

const createCommentHTML = function(guestBook, comments) {
  return guestBook.replace(COMMENTS_AREA, comments.join(NEW_LINE));
};

/**
 * Here response is passed just to maintain function signature
 * @param {Object} req http request
 * @param {Object} res  http response object
 */

const serveGuestBookPage = function(req, res) {
  fs.readFile(GUEST_BOOK_URL, UTF8, (error, guestBook) => {
    const commentsData = comment.userComments.map(createCommentsSection);
    const commentsHTML = createCommentHTML(guestBook, commentsData);
    send(res, 200, commentsHTML);
  });
};

/**
 * Used in order to add comment to comments.json
 * @param {Object} req http request object
 * @param {Object} res http response object
 */

const saveComment = function(req, res) {
  const commentDetails = parseCommentDetails(req.body);
  commentDetails.date = new Date();
  comment.addComment(commentDetails);
  serveGuestBookPage(req, res);
};

/**
 * To read users posted data and to read the file, both are same in this case
 * @param {Object} req  http request object
 * @param {Object} res http response object
 * @param {Function} next function to call next request handler method
 */

const readPostData = function(req, res, next) {
  const postData = { body: '' };
  req.on('data', chunk => (postData.body += chunk));
  req.on('end', error => {
    req.body = postData.body;
    next();
  });
};

/**
 * Its nothing but to help in refreshing the comments section
 * @param {Object} req
 * @param {Object} res
 */

const commentsHandler = function(req, res) {
  const commentsHTML = comment.userComments.map(createCommentsSection);
  send(res, 200, commentsHTML.join(NEW_LINE));
};

loadUserComments();

/**
 * Uses of Express framework
 */

app.use(logRequest);
app.use(readPostData);
app.get('/comments', commentsHandler);
app.get('/guest_book.html', serveGuestBookPage);
app.post('/guest_book.html', saveComment);
app.use(renderFile);

module.exports = app.handleRequest.bind(app);
