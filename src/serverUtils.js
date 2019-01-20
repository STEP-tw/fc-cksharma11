const parseCommentDetails = function(comment) {
  const commentObject = new Object();
  const decodedComment = decodeURIComponent(comment).replace(/\+/g, ' ');
  const [, author, , commentText] = decodedComment.split(/=|&/);
  commentObject.name = author;
  commentObject.comment = commentText;
  return commentObject;
};

const createCommentsSection = function({ date, name, comment }) {
  return `<p>${date}: <strong>${name}</strong> : ${comment}</p>`;
};

module.exports = {
  parseCommentDetails,
  createCommentsSection
};
