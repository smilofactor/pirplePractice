
/*
 * SVM
 * Primary file for the API
 * index.js
 */

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var config = require('./lib/config');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');


//Instantiate the HTTP server
var server = http.createServer(function(req,res) {
  unifiedServer(req,res);
});


//Start the server, listen on port 3000
server.listen(config.httpPort,function() {
  console.log("The server is listening on port "+config.httpPort);
});


//Instantiate the HTTPS server
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
var server = https.createServer(httpsServerOptions,function(req,res) {
  unifiedServer(req,res);
});


//Start the HTTPS server
server.listen(config.httpsPort,function() {
  console.log("The server is listening on port "+config.httpsPort);
});


//All the server logic for http and https belong to here
var unifiedServer = function(req,res) {

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
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };


    //Route the request to the handler specified in the router
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
var router = {
  'ping' : handlers.ping,
  'users' : handlers.users
  
};


