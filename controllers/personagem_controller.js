/**
 * Module dependencies.
 */

var Personagem = require('../models/personagem.js');

/**
 * POST /personagems
 * Create an personagem.
 * TODO: password strength verification.
 */

exports.create = function(req, res, next) {

  console.log(req.body);
  console.log(req.files);
  var personagem = new Personagem();
  
  personagem.nome = req.body.nome;
  personagem.pontos = req.body.pontos;
  personagem.forca = req.body.forca;
  personagem.habilidade = req.body.habilidade;
  personagem.resistencia = req.body.resistencia;
  personagem.armadura = req.body.armadura;
  personagem.poderDeFogo = req.body.poderDeFogo;
  personagem.vida = req.body.vida;
  personagem.magia = req.body.magia;    
  personagem.aventura = req.body.aventura;    

  personagem.vantagens = req.body.vantagens;
  personagem.desvantagens = req.body.desvantagens;
  personagem.equipamento = req.body.equipamento;
  personagem.background = req.body.background;
  personagem.codigo = req.body.codigo;
  personagem.imageUrl = req.body.imageUrl;

  if (req.body._id) {
    Personagem.findById(req.body._id, function (err, personagem) {
      if (err) return res.send(403);
      
      personagem.nome = req.body.nome;
      personagem.pontos = req.body.pontos;
      personagem.forca = req.body.forca;
      personagem.habilidade = req.body.habilidade;
      personagem.resistencia = req.body.resistencia;
      personagem.armadura = req.body.armadura;
      personagem.poderDeFogo = req.body.poderDeFogo;
      personagem.vida = req.body.vida;
      personagem.magia = req.body.magia; 
      personagem.aventura = req.body.aventura;  

      personagem.vantagens = req.body.vantagens;
      personagem.desvantagens = req.body.desvantagens;
      personagem.equipamento = req.body.equipamento;
      personagem.background = req.body.background;
      personagem.codigo = req.body.codigo;
      personagem.imageUrl = req.body.imageUrl;

      personagem.save(function (err) {
        if (err) {
          console.log(err);
          return res.send(403);
        }
        res.send(personagem);
      });
    });    
  }
  else{
    personagem.save(function (err) {
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
      res.send(personagem);
    });
  }  
};

exports.listarPorAventura = function(req, res, next) {

  var personagem = new Personagem();
  
  personagem.aventura = req.params.aventura;

  Personagem.listarPorAventura(personagem.aventura, function(err, personagems) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    res.send(personagems);
  });
}

exports.obterPorCodigo = function(req, res, next) {

  var personagem = new Personagem();
  
  personagem.codigo = req.params.codigo;

  Personagem.obterPorCodigo(personagem.codigo, function(err, personagems) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.

    res.send(personagems);
  });
}

exports.apagar = function(req, res, next) {

  Personagem.findOne({_id: req.params.id}).remove( function(err, result) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.
    res.send(200);
  });
}

exports.obter = function(req, res, next) {

  Personagem.findOne({_id: req.params.id}, function(err, personagem) {
    if(err) {
      // Mongoose error.
      return next(err);
    }

    // Created successfully.
    console.log(personagem);
    res.send(personagem);
  });
}



