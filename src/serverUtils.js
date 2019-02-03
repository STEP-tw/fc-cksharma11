const parseCommentDetails = function(comment) {
  console.log(comment);
  const commentObject = new Object();
  const decodedComment = decodeURIComponent(comment).replace(/\+/g, ' ');
  const [, author, , commentText] = decodedComment.split(/=|&/);
  commentObject.name = unescape(author);
  commentObject.comment = unescape(commentText);
  return commentObject;
};

const splitKeyValue = pair => pair.split('=');

const assignKeyValue = (parameters, [key, value]) => {
  parameters[key] = unescape(unescape(value));
  return parameters;
};

module.exports = {
  parseCommentDetails,
  splitKeyValue,
  assignKeyValue
};
