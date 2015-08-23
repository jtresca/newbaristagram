'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Order Schema
 */
var OrderSchema = new Schema({
  drink: String,
  size: String,
  milk: String,
  shot: String,
  foam: String,
  startTime: Date,
  endTime: Date,
  status: {type: String, default: "queued"},
  date: {type:Date, default:Date.now},
  customer: String,
  vip: String
});


/**
 * Validations
 */
// OrderSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Order', OrderSchema);

