const parseCommentDetails = function(comment) {
  const result = new Object();
  comment
    .split('&')
    .map(pair => pair.split('='))
    .map(([key, value]) => {
      result[key] = decodeURIComponent(value).replace(/\+/g, ' ');
    });
  return result;
};

const createCommentsSection = function(comment) {
  return `<p>${comment.date}:${comment.Name}:${comment.comment}</p>`;
};

module.exports = {
  parseCommentDetails,
  createJSON,
  createCommentsSection
};
