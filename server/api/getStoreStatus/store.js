'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StoreSchema = new Schema({
  status: {type: String, default: "closed"},
  date: {type:Date, default:Date.now}
});

/**
 * Validations
 */
// OrderSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Store', StoreSchema);
