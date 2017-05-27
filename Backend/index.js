var express = require("express")

var app = express();

var router = express.Router();
var port = 8088;
{
    console.log("People starting to visit");
}

var request = require('request');

app.all("/legislators", function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    console.log("request for legislators")
     request('http://congress.api.sunlightfoundation.com/legislators?per_page=100&apikey=1b18e2b4ba5b4865b27980b39d7f47b9', function (error, response, body) {
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });
});

app.all("/legislators/:type",function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    var type=req.params.type;
    console.log("Request for legislators in "+type);
    // if(type == both)
    request('http://congress.api.sunlightfoundation.com/legislators?chamber='+type+'&per_page=100&apikey=1b18e2b4ba5b4865b27980b39d7f47b9', function (error, response, body) {
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });

});

app.all("/committees/:type", function(req, res){
    var type=req.params.type;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    console.log("Request for Committees in "+type);
    request('http://congress.api.sunlightfoundation.com/committees?chamber='+type+'&per_page=50&apikey=1b18e2b4ba5b4865b27980b39d7f47b9', function (error, response, body) {
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });
});

app.all("/bills/:type", function(req, res){
    var type=req.params.type;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    console.log("Request for bills of "+type);
    var url;
    if(type=="active")
        url = 'http://congress.api.sunlightfoundation.com/bills?per_page=50&history.active=true&last_version.urls.pdf__exists=true&order=introduced_on__desc&apikey=1b18e2b4ba5b4865b27980b39d7f47b9';
    else if(type == "old")
        url = 'http://congress.api.sunlightfoundation.com/bills?per_page=50&last_version.urls.pdf__exists=true&history.active=false&order=introduced_on__desc&apikey=1b18e2b4ba5b4865b27980b39d7f47b9';
    request(url, function (error, response, body) {
        // console.log(response);
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });
});

app.all("/legisComm/:id", function(req, res){
    var id = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    url = "http://congress.api.sunlightfoundation.com/committees?per_page=5&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&member_ids="+id
    request(url, function (error, response, body) {
        // console.log(response);
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });
})

app.all("/legisBill/:id", function(req, res){
    var id = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    url = "http://congress.api.sunlightfoundation.com/bills?per_page=5&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&sponsor_id="+id
    request(url, function (error, response, body) {
        // console.log(response);
        if (error && response.statusCode != 200) {
            res.send("\
            <h1>\
            There is some error with the URL. Please check it first.\
            </h1>\
            ");
            // console.log(body) // Print the google web page.
        }
        var t = JSON.parse(body);
        res.send(t.results);
    });
})


app.all("/", function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    console.log("This is not a valid point");
    return res.status(500).send("<h1>Do not try to cheat</h1>");
    
});

app.listen(process.env.PORT || port);
