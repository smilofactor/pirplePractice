/*
 *
 *Helpers for varous tasks
 *
 */


//Container for all the helpers
var handlers = {};

//Create a SHA256 hash
helpers.push = function(str) {
  if(typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};




//Export the module
module.exports = helpers;
