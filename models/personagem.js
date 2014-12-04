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
  forca:{type: Number, required:false},
  habilidade: { type: Number, required: false},
  resistencia: { type: Number, required: false },
  armadura:{type: Number, required:false},
  poderDeFogo: { type: Number, required: false},
  vida: { type: Number, required: false },
  magia:{type: Number, required:false},
  aventura:{type: String, required:true},
  vantagens: { type: String, required: false },
  desvantagens: { type: String, required: false },
  equipamento:{type: String, required:false},
  background:{type: String, required:true},
});

PersonagemSchema.statics.listarPorAventura = function(aventura, callback) {
  return this.find({ aventura: aventura }, callback);
};


/*
 * Export Personagem model.
 */
module.exports = mongoose.model('Personagem', PersonagemSchema, 'personagens');