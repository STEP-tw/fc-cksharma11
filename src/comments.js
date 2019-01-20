const fs = require('fs');
const { COMMENTS_FILE, UTF8 } = require('./constants');

class Comments {
  constructor() {
    this.userComments = [];
  }

  readComments() {
    const data = fs.readFileSync(COMMENTS_FILE, UTF8);
    this.userComments = JSON.parse(data);
  }

  writeCommentsToFile() {
    fs.writeFile(COMMENTS_FILE, JSON.stringify(this.userComments), error => {});
  }

  addComment(comment) {
    this.userComments.unshift(comment);
    this.writeCommentsToFile();
  }
}

module.exports = Comments;
