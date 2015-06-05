var Feedback = require('../models/feedback.js');

/**
 * POST /feedback
 * Create an feedback.
 */

exports.create = function(req, res, next) {
  var feedback = new Feedback();
  
  feedback.mensagem = req.body.mensagem;

    feedback.save(function (err) {
      if (err) {
        if(err.name === 'MongoError' && err.code === 11000) {
          // Username already in use.
          return res.send(403);
        }
        else {
          // Something else went wrong.
          return next(err);
        }
      }

      // Created successfully.
      res.send(JSON.stringify(feedback));
    });
};