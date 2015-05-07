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

  if (req.body._id) {
    Aventura.findById(req.body._id, function (err, aventura) {
      if (err) return res.send(403);
      
      aventura.nome = req.body.nome;
      aventura.resumo = req.body.resumo;
      aventura.usuario = req.body.usuario;
      
      aventura.save(function (err) {
        if (err) return res.send(403);
        res.send(aventura);
      });
    });    
  }
  else{
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
      res.send(JSON.stringify(aventura));
    });
  }  
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

exports.obter = function(req, res, next) {

  Aventura.findOne({_id: req.params.id}, function(err, aventura) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.
    res.send(JSON.stringify(aventura));
  });
}



