var st = require('st'),
	http = require('http'),
	port = process.env.PORT || 8080;

http.createServer(
  st({
   path: process.cwd(),
   cors: true
  })
).listen(port);

console.log('Server running on ' + port);

