"use strict";

var http = require("http"),
    urlparse = require("url").parse;


var config = {
    "/web1": "http://localhost:8080/",
    "/web2": "http://localhost:8081/"
};

function Router(req,res) {
    var route,url, preceding,matched;
    for(route in config){
        url = urlparse(req.url);
        var m = url.pathname.match(route);
        if(m) {
            preceding = m.input.substr(route,1);
            if(preceding == "" || preceding == "/") {
                matched = route;
                break;
            }
        }
    }
    console.log(matched);
    if(!matched) {
        res.writeHead(404);
        res.end();
        return;
    }

    var target = urlparse(config[matched]);
    var request = http.request({
        hostname:target.hostname,
        port: target.port,
        method: req.method,
        path: target.path + url.path.replace(matched,"")
    },function(response){
        response.pipe(res);
    });
    req.pipe(request);
}


module.exports = Router;
