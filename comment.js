// Create web server
// This is a simple web server to handle comments
// The server will respond to any request with a simple HTML page
// that lists all the comments that have been posted so far
// and provides a form to enter a new comment.

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var comments = require('./comments');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  // Parse the request containing file name
  var pathname = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;
  var queryObj = querystring.parse(query);
  var filename = "." + pathname;
  var ext = path.extname(filename);
  var type = '';
  switch (ext) {
    case '.html':
      type = 'text/html';
      break;
    case '.js':
      type = 'text/javascript';
      break;
    case '.css':
      type = 'text/css';
      break;
    case '.json':
      type = 'application/json';
      break;
    case '.png':
      type = 'image/png';
      break;
    case '.jpg':
      type = 'image/jpg';
      break;
    case '.wav':
      type = 'audio/wav';
      break;
  }
  if (filename === './') {
    filename = './index.html';
  }
  if (queryObj['comment'] !== undefined) {
    comments.addComment(queryObj['comment']);
  }
  if (pathname === '/getComments') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(comments.getComments()));
  } else {
    fs.readFile(filename, function (err, data) {
      if (err) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        return response.end("404 Not Found");
      }
      response.writeHead(200, { 'Content-Type': type });
      response.write(data);
      return response.end();
    });
  }
});

// Listen on port 8080, IP defaults to
