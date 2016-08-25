var express = require('express');
var app = module.exports.app = exports.app = express();

app.use(require('connect-livereload')());

app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/html/index.html');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
