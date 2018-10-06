/*
 *
 * Library for storing and editing data
 *
 */

//Dependencies
var fs = require('fs');
var path = require('path');


//Container for the module (to be exported)
var lib = {};


//Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');


//Write data to a file
lib.create = function(dir,file,data,callback){
  //Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if(!err && fileDescriptor) {
      //Convert data to string
      var stringData = JSON.stringify(data);

      //Write to file and close it
      fs.writeFile(fileDescriptor,stringData,function(err){
        if(!err) {
          fs.close(fileDescriptor,function(err){
            if(!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });

        } else {
          callback('Error writing to new file');
        }
      });

    } else {
      callback('Could not create new file, may already exist');
    }

  });

};


//Read data from a file
lib.read = function(dir,file,callback) {
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
   callback(err,data);
  });

};


//Update data inside file
lib.update = function(dir,file,data,callback){
  //Open file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor) {
    if(!err && fileDescriptor) {
      var stringData = JSON.stringify(data);
      
      //Truncate the file
      fs.truncate(fileDescriptor,function(err) {
        if(!err) {
          //Write to file and close it
          fs.writeFile(fileDescriptor,stringData,function(err){
            if(!err) {
              fs.close(fileDescriptor,function(err) {
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              });
            } else {
              callback('Error writing to existin file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for updating, may not exist yet');
    }
  });

};


//Deleting file functionality
lib.delete = function(dir,file,callback) {
  //Unlink
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
    if(!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
};



//Export module
module.exports = lib;
