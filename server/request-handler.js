/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var http = require('http');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');
var path = require('path');

var messages = [{ 'username': 'chatterbot', 'text': 'beep beep bop', 'roomname': 'lobby', 'objectId': 0 }];
var messageCount = 1;
var initialized = false;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {

  var statusCode;
  var url = request.url;

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  //serves the html file to client upon initial request/connection
  if ( request.url === '/' ) {

    var indexHtml = fs.readFileSync('../client/index.html', {encoding: 'utf8'});
    response.writeHeader(200);
    response.write(indexHtml);
    response.end();

    //fields requests getting and posting messages
  } else if ( url === '/classes/messages' ) {
    
    if ( request.method === 'GET' ) {
      
      statusCode = 200;

    } else if ( request.method === 'POST' ) {
      
      var body = '';
      
      statusCode = 201;

      request.on('data', function(chunk) {
        body += chunk.toString();
      });

      request.on('end', function() {
        var message = JSON.parse(body);
        message.objectId = messageCount;
        messageCount++;

        messages.push(message);

      });
    
    } else if ( request.method === 'OPTIONS' ) {
      
      statusCode = 200;
    
    } else { //method not allowed, 405
      
      statusCode = 405;
    
    }

    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);

    response.end('{"results":' + JSON.stringify(messages) + '}');
  
  } else {
    //serves files specified by html file
    var file = fs.readFileSync('../client' + request.url, {encoding: 'utf8'});
    
    if (file === undefined) {
      response.writeHeader(404);
      response.end();
    
    } else {
    
      var filetype = path.extname(request.url);
      if ( filetype === '.js' ) {
        response.writeHeader(200, {'Content-Type': 'text/javascript'});
      } else { response.writeHeader(200); }

      response.write(file);
      response.end();
    }
  }
};

exports.requestHandler = requestHandler;