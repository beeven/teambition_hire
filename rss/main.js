var http = require("http"),
    parsexml = require("xml2js").parseString,
    fs = require("fs");


function Crawler(rssfeed) {
    this.feed = rssfeed;
}


Crawler.prototype.fetch = function(){
        console.log(this.feed);
        var data = "";
        var req = http.get(this.feed,function(res){
            res.setEncoding("utf8");
            res.on('data',function(chunk){
                data += chunk.toString();
            });
            res.on("end",function(){
                parsexml(data,function(err,result){
                    if(err){console.error(err);return;}
                    if(result.rss && result.rss.channel) {
                        result.rss.channel.forEach(function(c){
                            writeToDir(c);
                        });
                    }
                });
            });
        }).on('error',function(err){
            console.error(err);
        });
};

var writeToFile = function(c){
        var content = "";
        var i;
        for(i=0;i<c.item.length;i++) {
            content += c.item[i].title[0] + "\n";
            content += c.item[i].description[0] + "\n\n"
        }
        fs.writeFile(c.title+".txt",content);
    }

var writeToDir = function(c) {
    var r = /<img.+?src=["'](.+?)["'].*?>/g;
        fs.exists(c.title[0],function(result){
            if(!result){ fs.mkdirSync(c.title[0])}
            var path = c.title[0]+"/";
            c.item.forEach(function(item){
                var match;
                do{
                    match = r.exec(item.description[0]);
                    if(match) {
                        http.get(match[1],function(res){
                            var fname = res.req.path.match(/.*\/(.+)/);
                            if(fname) {
                                var ws = fs.createWriteStream(path+fname[1]);
                                res.pipe(ws);
                                res.on('end',function(){ws.close();});
                            }
                        });
                    }
                }while(match);
            });
        });
    };


(function main() {
    var opts = require("nomnom")
        .option("file",{
            abbr: 'f',
            default: 'feeds.txt',
            help: 'feeds with urls to fetch'
        })
        .option("url",{
            abbr: 'u',
            list: true,
            help: 'url to fetch'
        })
        .parse();

    console.log(opts);
    var feeds = fs.readFileSync(opts.file).toString().split("\n").filter(function(a){return a!=""});

    feeds.forEach(function(feed){
        var c = new Crawler(feed.trim());
        c.fetch();
    });

})();


/*
var crawler = new Crawler(feeds[0].trim());
crawler.fetch();
*/
