
/*
 *
 *Template Data
 *SVM
 *Added this file to seperate data from code
 *
 */

//All data for all templates
var templateConfig = {};


templateConfig.staging = {
  'index' : {
    'head' : { 'title' : 'Uptime Monitoring - Made Simple',
               'description' : 'We offer free, simple monitoring for HTTP/HTTPS sites of all kinds. When your site goes down we\'ll send you a text to let you know.'
    },

    'body' : { 'titleH1' : 'Uptime Monitoring',
               'titleH2' : 'Made Simple',
               'class' : 'index'
    }
  },

  'accountCreate' : {
      'head' : { 'title' : 'Create An Account',
                 'description' : 'Signup is easy and only takes a few seconds.'
      },

      'body' : { 'class' : 'accountCreate',
                 'titleH1' : 'Create Your Account',
                 'titleH2' : 'Signup is easy and only takes a few seconds'
      }
  }

};


templateConfig.production = {
  'index' : {
    'head' : { 'title' : 'Uptime Monitoring - Made Simple',
               'description' : 'We offer free, simple monitoring for HTTP/HTTPS sites of all kinds. When your site goes down we\'ll send you a text to let you know.'
    },

    'body' : { 'titleH1' : 'Uptime Monitoring',
               'titleH2' : 'Made Simple',
               'class' : 'index'
    } 
  },

  'accountCreate' : {
      'head' : { 'title' : 'Create An Account',
                 'description' : 'Signup is easy and only takes a few seconds.'
      },

      'body' : { 'class' : 'accountCreate',
                 'titleH1' : 'Create Your Account',
                 'titleH2' : 'Signup is easy and only takes a few seconds'
      }
  }

};

//Determine which environment should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'
                                  ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the environments above
//If not default to staging
var environmentToExport = typeof(templateConfig[currentEnvironment]) == 'object' 
                                  ? templateConfig[currentEnvironment] : templateConfig.staging;



module.exports = environmentToExport;
