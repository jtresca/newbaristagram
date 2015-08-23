'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
// var Order = require('./newOrder.model');


// Get list of newOrders
exports.index = function(req, res) {
  Order.find(function (err, newOrders) {
    if(err) { return handleError(res, err); }
    return res.json(200, newOrders);
  });
};

// Get a single newOrder
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, newOrder) {
    if(err) { return handleError(res, err); }
    if(!newOrder) { return res.send(404); }
    return res.json(newOrder);
  });
};

// Creates a new newOrder in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, newOrder) {
    if(err) { return handleError(res, err); }
    return res.json(201, newOrder);
  });
};

exports.newOrder = function(req, res) {
  Order.create(req.body, function (err, order) {
      if (!err) {
      return res.json(order);
      } else {
      return res.send(err);
      }
  });
};

// Updates an existing newOrder in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, newOrder) {
    if (err) { return handleError(res, err); }
    if(!newOrder) { return res.send(404); }
    var updated = _.merge(newOrder, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, newOrder);
    });
  });
};

// Deletes a newOrder from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, newOrder) {
    if(err) { return handleError(res, err); }
    if(!newOrder) { return res.send(404); }
    newOrder.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}