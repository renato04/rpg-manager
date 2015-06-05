/**
 * Module dependencies.
 */

var mongoose = require('mongoose');


/**
 * Schema.
 */

var FeedbackSchema = new mongoose.Schema({
  mensagem: { type: String, required: true}
});


/*
 * Export Feedback model.
 */
module.exports = mongoose.model('Feedback', FeedbackSchema, 'feedback');