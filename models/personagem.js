/**
 * Module dependencies.
 */

var mongoose = require('mongoose');


/**
 * Schema.
 */

var PersonagemSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  pontos: { type: String, required: false },
  forca:{type: String, required:false},
  habilidade: { type: String, required: false},
  resistencia: { type: String, required: false },
  armadura:{type: String, required:false},
  poderDeFogo: { type: String, required: false},
  vida: { type: String, required: false },
  magia:{type: String, required:false},
  aventura:{type: String, required:true}
});

PersonagemSchema.statics.listarPorAventura = function(aventura, callback) {
  return this.find({ aventura: aventura }, callback);
};


/*
 * Export Personagem model.
 */
module.exports = mongoose.model('Personagem', PersonagemSchema, 'personagens');