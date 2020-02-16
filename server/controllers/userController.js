var express = require("express");
var user = require('../models/user');
var router = express.Router();
var cfenv = require("cfenv");
var Cloudant = require('@cloudant/cloudant');  // Load the Cloudant library.
var cloudant, mydb;


/*-------------------------------Cloudantant Configuration--------------------------------*/
var vcapLocal; // load local VCAP configuration  and service credentials
try {
  vcapLocal = require('../vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }
const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {
  if (appEnv.services['cloudantNoSQLDB']) {    // Initialize database with credentials
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);  // CF service named 'cloudantNoSQLDB'
  } else {
    cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);   // user-provided service with 'cloudant' in its name
  }
} else if (process.env.CLOUDANT_URL) {
  cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if (cloudant) {
  var dbName = 'mydb';    //database name
  cloudant.db.create(dbName, function (err, data) {   // Create a new "mydb" database.
    if (!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });
  mydb = cloudant.db.use(dbName);     // Specify the database we are going to use (mydb)...
}
/*----------------------------------------------------------------------------------------------*/


router.post('/users/signup', function (req, res, next) {
    var username = "Osama";
    const user = {
      username: username
    }
    mydb.insert(user, function (err, body) {
      if (err) { return next(err); }
      res.json({ user: user })
    });
  });
  
  
  module.exports = router;