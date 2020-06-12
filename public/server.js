var express = require('express');
var firebase = require("firebase");
var nodemailer = require('nodemailer');
var path = require('path');
var httpProxy = require('http-proxy');
var app = express();


var staticPath = path.resolve(__dirname,'.');


app.use(express.static(staticPath));


var proxy = httpProxy.createProxyServer({});

app.all('/esoami/webapi/*' , function(req,res,next){

	proxy.web(req,res,{target:'http://localhost:8080'});
});




/*client.messages.create({
    body: "Soami homeopathy clinic test message",
    to: "+919448051157",
    from: "+13853557310"
    
}, function(err, message) {
    process.stdout.write(message);
});


});
*/


app.listen(6352, function(){


	console.log("listening at 6352 for 82");
});