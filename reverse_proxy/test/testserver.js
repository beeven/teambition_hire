var express = require('express'),
    app = express();

app.get("/",function(req,res){
    console.log("GET /");
    res.status(200).end("Hello");
});

app.listen(8080);
app.listen(8081);
