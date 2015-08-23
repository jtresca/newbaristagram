'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UpdateOrderSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('UpdateOrder', UpdateOrderSchema);