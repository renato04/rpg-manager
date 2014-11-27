/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , bcrypt = require('bcrypt');

/**
 * Bcrypt Rounds.
 */

var bcryptRounds = process.env.BCRYPT_ROUNDS || 10;

/**
 * Schema.
 */

var AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  email:{type: String, required:true}
});

/*
 * Set hash from a clear text password.
 */

AccountSchema.method('setHash', function(password, callback) {
  var self = this;
  
  bcrypt.genSalt(bcryptRounds, function(err, salt) {
    if(err) {
      return callback(err);
    }

    bcrypt.hash(password, salt, function(err, hash) {
      if(err) {
        return callback(err);
      }

      self.hash = hash;

      callback();
    });
  });
});

/*
 * Validate the password.
 */

AccountSchema.method('validatePassword', function (password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

/*
 * Authenticate a user. Will also update password hash if
 * the password is valid and a different number of rounds
 * (higher or lower) has been specified.
 */

AccountSchema.static('authenticate', function (username, password, callback) {
  // Find account by username.
  this.findOne({ username: username }, function(err, account) {
    if (err) {
      // Mongoose error.
      return callback(err);
    }

    if (!account) {
      // Account not found.
      return callback(null, false);
    }

    account.validatePassword(password, function(err, correct) {
      if (err) {
        // bcrypt error.
        return callback(err);
      }

      if (!correct) {
        // Invalid password.
        return callback(null, false);
      }

      // Valid password

      if(bcrypt.getRounds(account.hash) !== bcryptRounds) {
        // Different number of rounds has been specified,
        // update the password hash.
        account.setHash(password, function(err) {
          if(err) {
            return callback(err);
          }

          account.save(function(err) {
            if(err) {
              // Mongoose error.
              return callback(err);
            }

            // Hash updated, proceed as planned.
            return callback(null, account);
          });
        });
      }
      else {
        // Number of rounds is the same, proceed.
        return callback(null, account);
      }
    });
  });
});

/*
 * Export Account model.
 */

module.exports = mongoose.model('Account', AccountSchema, 'users');