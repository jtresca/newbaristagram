'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// Get list of queuedAllUserOrderss
exports.index = function(req, res) {
  Order.find(function (err, queuedAllUserOrderss) {
    if(err) { return handleError(res, err); }
    return res.json(200, queuedAllUserOrderss);
  });
};

exports.queuedAllUserOrders = function(req, res) {
  return Order.find( { $or: [ { status: "brewing" }, { status: "queued" } ] }, function (err, orders) {
    if (!err) {
      return res.json(orders);
    } else {
      return res.send(err);
    }
  });
};

// Get a single queuedAllUserOrders
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, queuedAllUserOrders) {
    if(err) { return handleError(res, err); }
    if(!queuedAllUserOrders) { return res.send(404); }
    return res.json(queuedAllUserOrders);
  });
};

// Creates a new queuedAllUserOrders in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, queuedAllUserOrders) {
    if(err) { return handleError(res, err); }
    return res.json(201, queuedAllUserOrders);
  });
};

// Updates an existing queuedAllUserOrders in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, queuedAllUserOrders) {
    if (err) { return handleError(res, err); }
    if(!queuedAllUserOrders) { return res.send(404); }
    var updated = _.merge(queuedAllUserOrders, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, queuedAllUserOrders);
    });
  });
};

// Deletes a queuedAllUserOrders from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, queuedAllUserOrders) {
    if(err) { return handleError(res, err); }
    if(!queuedAllUserOrders) { return res.send(404); }
    queuedAllUserOrders.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}