var http = require('http');

http.createServer(function(req,res) {
  res.end("Node Version: " + process.version);
}).listen(process.env.PORT || 3000);

console.log('Listening');