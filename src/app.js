const fs = require('fs');

const getFileName = function(url) {
  if (url == '/') return './index.html';
  return '.' + url;
};

const app = (req, res) => {
  const path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    if (!err) {
      res.write(data);
      res.end();
    }
    res.statusCode = 404;
    res.end();
  });
};
// Export a function that can act as a handler

module.exports = app;
