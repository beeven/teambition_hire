var http = require("http");

var router = require('./router');


http.createServer(router).listen(8000);
