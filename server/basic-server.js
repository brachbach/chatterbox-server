var http = require('http');
var handleRequest = require('./request-handler.js');
var express = require('express');
var fs = require('fs');

var app = express();
var port = 3000;
var ip = '127.0.0.1';
app.listen(port, ip);

var messages;
var messageCount = 1;

messages = JSON.parse(fs.readFileSync('log.json', {encoding: 'utf8'}));

app.use(express.static('../client'));

app.route('/classes/messages')
  .get(function(request, response) {
    console.log(request.url);
    response.status(200).send({'results': messages });
  })
  .post(function(request, response) {
    var body = '';

    request.on('data', function(chunk) {
      body += chunk.toString();
    });

    request.on('end', function() {
      var message = JSON.parse(body);
      message.objectId = messageCount;
      messageCount++;
      messages.push(message);

      //save messages to log
      var messageCopy = messages.slice();
      fs.writeFile('log.json', JSON.stringify(messageCopy));

      response.status(201).send(message);
    });
  })
  .options(function(request, response) {
    response.status(200).end();
  });

console.log('Express server listening on port ' + port);
