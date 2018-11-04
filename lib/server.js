
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
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined'
                                ? server.router[trimmedPath] : handlers.notFound;

    //If the request is within the public directory use the public handler instead     
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
    
    //Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    //Route the request to the handler specified in the server.router
    chosenHandler(data,function(statusCode,payload,contentType) {

      //Determine the type of response (fallback to JSON)
      contentType = typeof(contentType) == 'string' ? contentType : 'json';

      //Use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;


      //Return response-parts that are content-specific
      var payloadString = '';
      if(contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof(payload) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);

      } 

      if(contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string' ? payload : '';

      }

      if(contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      if(contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      if(contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      if(contentType == 'jpeg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      if(contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      if(contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';

      }

      //Return response-parts that are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);

      //If the response is 200 print one color otherwise print another
      //if(statusCode == 200){
        //debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
      //} else {
        //debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
      //}

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
  '' : handlers.index,
  'account/create' : handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accountDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all' : handlers.checksList,
  'checks/create' : handlers.checksCreate,
  'checks/edit' : handlers.checksEdit,
  'ping' : handlers.ping,
  'api/users' : handlers.users,
  'api/tokens' : handlers.tokens,
  'api/checks' : handlers.checks,
  'favicon.ico': handlers.favicon,
  'public' : handlers.public
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
