const refreshComments = function() {
  fetch('/comments').then(response =>
    response.text().then(text => {
      document.getElementById('comment_section').innerHTML = text;
    })
  );
};

window.onload = function() {
  document.getElementById('refresh_comments').onclick = refreshComments;
};
