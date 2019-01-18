const parseCommentDetails = function(comment) {
  const commentObject = new Object();
  const decodedComment = decodeURIComponent(comment).replace(/\+/g, ' ');
  const [, author, , commentText] = decodedComment.split(/=|&/);
  commentObject.Name = author;
  commentObject.comment = commentText;
  return commentObject;
};

const createCommentsSection = function(comment) {
  return `<p>${comment.date}:${comment.Name}:${comment.comment}</p>`;
};

module.exports = {
  parseCommentDetails,
  createCommentsSection
};
