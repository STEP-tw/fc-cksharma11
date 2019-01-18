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

const createJSON = function(data) {
  const rawData = '[' + data.replace(/}{/g, '},{') + ']';
  return JSON.parse(rawData).reverse();
};

const createCommentsSection = function(guest_book, commentsJSON) {
  commentsJSON.forEach(comment => {
    guest_book += `<p>${comment.date}:${comment.Name}:${comment.comment}</p>`;
  });
  return guest_book;
};

module.exports = {
  parseCommentDetails,
  createJSON,
  createCommentsSection
};
