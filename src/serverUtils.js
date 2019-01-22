const parseCommentDetails = function(comment) {
  const commentObject = new Object();
  const decodedComment = decodeURIComponent(comment).replace(/\+/g, ' ');
  const [, author, , commentText] = decodedComment.split(/=|&/);
  commentObject.name = unescape(author);
  commentObject.comment = unescape(commentText);
  return commentObject;
};


module.exports = {
  parseCommentDetails,
};
