'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// Get list of updateOrders
exports.index = function(req, res) {
  Order.find(function (err, updateOrders) {
    if(err) { return handleError(res, err); }
    return res.json(200, updateOrders);
  });
};

// Get a single updateOrder
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, updateOrder) {
    if(err) { return handleError(res, err); }
    if(!updateOrder) { return res.send(404); }
    return res.json(updateOrder);
  });
};

// Creates a new updateOrder in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, updateOrder) {
    if(err) { return handleError(res, err); }
    return res.json(201, updateOrder);
  });
};

exports.updateOrder = function(req, res) {
  Order.findByIdAndUpdate(req.params.orderId, { $set: req.body }, function (err, orders) {console.log(err,orders)
    if (!err) {
      console.log(orders);
      return res.json(orders);
    } else {
      return res.send(err);
    }
  });
};

// Updates an existing updateOrder in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, updateOrder) {
    if (err) { return handleError(res, err); }
    if(!updateOrder) { return res.send(404); }
    var updated = _.merge(updateOrder, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, updateOrder);
    });
  });
};

// Deletes a updateOrder from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, updateOrder) {
    if(err) { return handleError(res, err); }
    if(!updateOrder) { return res.send(404); }
    updateOrder.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}