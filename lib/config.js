/*
 *
 *Create and export configuration variables
 *
 */

//Container for all the environments
var environments = {};

//Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio': {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : '+15005550006'
    },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'NotARealComp',
    'yearCreated' : '2018',
    'baseUrl' : 'https://localhost:3000'
  }
};


//Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio': {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : '+15005550006'
    },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'NotARealComp',
    'yearCreated' : '2018',
    'baseUrl' : 'https://localhost:5000'
  }
};


//Determine which environment should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'
                                  ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the environments above
//If not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' 
                                  ? environments[currentEnvironment] : environments.staging;


//Export the module
module.exports = environmentToExport;
