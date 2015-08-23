'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// Get list of allUserHistorys
exports.index = function(req, res) {
  Order.find(function (err, allUserHistorys) {
    if(err) { return handleError(res, err); }
    return res.json(200, allUserHistorys);
  });
};

exports.allUserHistory = function(req, res) {
  return Order.find( { $or: [ { status: "completed" }, { status: "canceled" } ] }, function (err, orders) {
    if (!err) {
      return res.json(orders);
    } else {
      return res.send(err);
    }
  });
};

// Get a single allUserHistory
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, allUserHistory) {
    if(err) { return handleError(res, err); }
    if(!allUserHistory) { return res.send(404); }
    return res.json(allUserHistory);
  });
};

// Creates a new allUserHistory in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, allUserHistory) {
    if(err) { return handleError(res, err); }
    return res.json(201, allUserHistory);
  });
};

// Updates an existing allUserHistory in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, allUserHistory) {
    if (err) { return handleError(res, err); }
    if(!allUserHistory) { return res.send(404); }
    var updated = _.merge(allUserHistory, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, allUserHistory);
    });
  });
};

// Deletes a allUserHistory from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, allUserHistory) {
    if(err) { return handleError(res, err); }
    if(!allUserHistory) { return res.send(404); }
    allUserHistory.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}