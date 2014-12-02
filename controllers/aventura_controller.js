/**
 * Module dependencies.
 */

var Aventura = require('../models/aventura.js');

/**
 * POST /aventuras
 * Create an aventura.
 * TODO: password strength verification.
 */

exports.create = function(req, res, next) {
  var aventura = new Aventura();
  
  aventura.nome = req.body.nome;
  aventura.resumo = req.body.resumo;
  aventura.usuario = req.body.usuario;
  

  // Hash created witout error, save aventura.
  aventura.save(function (err) {
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
      res.send(201);
    });  
};

exports.listarPorUsuario = function(req, res, next) {

  var aventura = new Aventura();
  
  aventura.usuario = req.params.usuario;

  Aventura.findByUser(aventura.usuario, function(err, aventuras) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.
    res.send(JSON.stringify(aventuras));
  });
}

exports.apagar = function(req, res, next) {

  Aventura.findOne({_id: req.params.id}).remove( function(err, result) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.
    res.send(200);
  });
}


