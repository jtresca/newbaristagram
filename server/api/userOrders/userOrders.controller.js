'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
// var UserOrders = require('./userOrders.model');

// Get list of userOrderss
exports.index = function(req, res) {
  Order.find(function (err, userOrderss) {
    if(err) { return handleError(res, err); }
    return res.json(200, userOrderss);
  });
};

// Get a single userOrders
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, userOrders) {
    if(err) { return handleError(res, err); }
    if(!userOrders) { return res.send(404); }
    return res.json(userOrders);
  });
};

// Creates a new userOrders in the DB.
exports.userOrders = function(req, res) {
  return Order.find({ customer: req.params.user }, function (err, orders) {
    if (!err) {
      return res.json(orders);
    } else {
      return res.send(err);
    }
  });
};
exports.create = function(req, res) {
  Order.create(req.body, function(err, userOrders) {
    if(err) { return handleError(res, err); }
    return res.json(201, userOrders);
  });
};

// Updates an existing userOrders in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, userOrders) {
    if (err) { return handleError(res, err); }
    if(!userOrders) { return res.send(404); }
    var updated = _.merge(userOrders, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, userOrders);
    });
  });
};

// Deletes a userOrders from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, userOrders) {
    if(err) { return handleError(res, err); }
    if(!userOrders) { return res.send(404); }
    userOrders.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}