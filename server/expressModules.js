var express = require('express');

var messages;
var messageCount = 1;
var url = request.url;

app.use(express.static('../client'));

app.get('/', function(request, response) {
  messages = JSON.parse(fs.readFileSync('log.json', {encoding: 'utf8'}));
  var indexHtml = fs.readFileSync('../client/index.html', {encoding: 'utf8'});
  response.status(200).send(indexHtml);
});

app.route('/classes/messages')
  .get(function(request, response) {
    response.writeHead(statusCode);
    response.status(200).send('{"results":' + JSON.stringify(messages) + '}');
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