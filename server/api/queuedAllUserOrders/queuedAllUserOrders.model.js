'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QueuedAllUserOrdersSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('QueuedAllUserOrders', QueuedAllUserOrdersSchema);