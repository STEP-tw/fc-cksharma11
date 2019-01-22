const getCommentsDiv = document => document.getElementById('comment_section');

const updateComments = function(comments) {
  const commentsDiv = getCommentsDiv(document);
  commentsDiv.innerHTML = createCommentHtml(comments);
};

const refreshComments = function() {
  fetch('/comments')
    .then(response => response.json())
    .then(updateComments);
};

const createCommentHtml = function(comments) {
  return comments.map(createCommentsSection).join('\n');
};

const createCommentsSection = function({ date, name, comment }) {
  const localDate = new Date(date).toLocaleString();
  return `<p>${localDate}: <strong>${name}</strong> : ${comment}</p>`;
};

window.onload = function() {
  refreshComments();
  document.getElementById('refresh_comments').onclick = refreshComments;
};
