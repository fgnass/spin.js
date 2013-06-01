
var static = require('node-static'),
    fileServer = new static.Server('.'),
    http;

exports.server = function() {
  http = require('http').createServer(function (request, response) {
      request.addListener('end', function () {
          fileServer.serve(request, response);
      }).resume();
  }).listen(9001);

  return http;
};
