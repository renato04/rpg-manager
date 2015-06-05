/**
 * Module dependencies.
 */

var mongoose = require('mongoose');


/**
 * Schema.
 */

var AventuraSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  resumo: { type: String, required: false },
  usuario:{type: String, required:true},
  anotacao:{type: String, required:false},
});

AventuraSchema.statics.findByUser = function(usuario, callback) {
  return this.find({ usuario: usuario }, callback);
};


/*
 * Export Aventura model.
 */
module.exports = mongoose.model('Aventura', AventuraSchema, 'aventuras');