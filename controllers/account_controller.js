/**
 * Module dependencies.
 */

var Account = require('../models/account.js');

/**
 * POST /accounts
 * Create an account.
 * TODO: password strength verification.
 */

exports.create = function(req, res, next) {
  var account = new Account();
  
  account.username = req.body.username;
  account.email = req.body.email;
  
  // Create hash from clear text password using bcrypt
  account.setHash(req.body.password, function(err) {
    if(err) {
      return next(err);
    }

    // Hash created witout error, save account.
    account.save(function (err) {
      if (err) {
        if(err.name === 'MongoError' && err.code === 11000) {
          // Username already in use.
          return res.send('Username already in use', 403);
        }
        else {
          // Something else went wrong.
          return next(err);
        }
      }

      // Created successfully.
      res.send(201);
    });  
  });
};

exports.logon = function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    Account.authenticate(username, password, function(err, account) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    if(!account) {
      // Bad username or password.
      return res.send(401);
    }

    // Created successfully.
    res.send(JSON.stringify(account));
  });
}
/**
 * Authenticate a request using basic HTTP authentication.
 * Internal method to be called on all routes requiring authentication.
 */

exports.authenticate = function(req, res, next) {
  // var realm = process.env.AUTH_REALM || 'API' 
  //   , authorization = req.headers['authorization']
  //   , token, decoded, parts, username, password;

  // if(!authorization) {
  //   // No credentials sent.
  //   res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  //   return res.send(401);
  // }

  // token = authorization.split(' ')[1];
  // decoded = new Buffer(token, 'base64').toString();
  // parts = decoded.split(':');
  // username = parts[0];
  // password = parts[1];

  // Account.authenticate(username, password, function(err, account) {
  //   if(err) {
  //     // Mongoose error.
  //     return next(err);
  //   }

  //   if(!account) {
  //     // Bad username or password.
  //     return res.send(401);
  //   }

  //   // Authentic, attach account._id for the next handler to access.
  //   req.account_id = account._id;

  //   // We're done here.
  //   next();
  // });
};