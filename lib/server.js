
/*
 * SVM
 * Server related tasks
 * server.js
 */

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var config = require('./config');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');


//Instantiate server module object
var server = {};


//@TODO GET RID OF THIS
//helpers.sendTwilioSms('4155551212','Test',function(err){
helpers.sendTwilioSms('4153334455','Test',function(err){
  console.log('this was the error: ',err);
  //debug('In helpers.sendTwilioSms this was the error: ', err);
});


//Instantiate the HTTP server
server.httpServer = http.createServer(function(req,res) {
  server.unifiedServer(req,res);
});


//Instantiate the HTTPS server
server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res) {
  server.unifiedServer(req,res);
});



//All the server logic for http and https belong to here
server.unifiedServer = function(req,res) {

  //Get URL and parse it
  var parsedUrl = url.parse(req.url,true);


  //Get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');


  //Get the query string as an object
  var queryStringObject = parsedUrl.query;
  

  //Get headers as an object
  var headers = req.headers;


  //Get the HTTP method
  var method = req.method.toLowerCase();


  //Get payload if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });

  req.on('end',function(){
    buffer += decoder.end();


    //Choose handler that this request goes to
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    //Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };


    //Route the request to the handler specified in the server.router
    chosenHandler(data,function(statusCode,payload) {
      //Use the status code called back by the handler
      //or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      

      //Use the payload called back by the handler
      //or default to and empty object
      payload = typeof(payload) == 'object' ? payload : {};


      var payLoadString = JSON.stringify(payload);

      //Return response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payLoadString);

      //Log the requested path
      console.log('Returning statusCode is: ',statusCode,payLoadString);

    });

  });



  /*SVM
   * Leaving this in to troubleshoot in the future
  //Log the request path
  console.log('\nQueryStringObject is: ',queryStringObject,
                '\ntrimmedPath is: '+trimmedPath+ 
                '\nrequest received with these headers',headers,
                '\nrequest received with this buffer',buffer,
                '\nusing this method: '+method);
  */
 


};


//Define a request router
server.router = {
  'ping' : handlers.ping,
  'users' : handlers.users,
  'tokens' : handlers.tokens,
  'checks' : handlers.checks
};


//Init script
server.init = function() {
  //Start the server, listen on port 3000
  server.httpServer.listen(config.httpPort,function() {
    console.log("The server is listening on port "+config.httpPort);

  //Start the HTTPS server
  server.httpsServer.listen(config.httpsPort,function() {
    console.log("The server is listening on port "+config.httpsPort);

});

});


}


//Export the module
module.exports = server;
