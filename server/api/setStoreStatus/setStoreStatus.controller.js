'use strict';

var _ = require('lodash');

var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Store = mongoose.model('Store');


// Get list of setStoreStatuss
exports.index = function(req, res) {
  Store.find(function (err, setStoreStatuss) {
    if(err) { return handleError(res, err); }
    return res.json(200, setStoreStatuss);
  });
};

// Get a single setStoreStatus
exports.show = function(req, res) {
  Store.findById(req.params.id, function (err, setStoreStatus) {
    if(err) { return handleError(res, err); }
    if(!setStoreStatus) { return res.send(404); }
    return res.json(setStoreStatus);
  });
};

exports.setStoreStatus = function(req, res) {
  Store.create(req.body, function (err, status) {
    if (!err) {
      return res.json(status);
    } else {
      return res.send(err);
    }
  });
};

// Creates a new setStoreStatus in the DB.
exports.create = function(req, res) {
  Store.create(req.body, function(err, setStoreStatus) {
    if(err) { return handleError(res, err); }
    return res.json(201, setStoreStatus);
  });
};

// Updates an existing setStoreStatus in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Store.findById(req.params.id, function (err, setStoreStatus) {
    if (err) { return handleError(res, err); }
    if(!setStoreStatus) { return res.send(404); }
    var updated = _.merge(setStoreStatus, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, setStoreStatus);
    });
  });
};

// Deletes a setStoreStatus from the DB.
exports.destroy = function(req, res) {
  Store.findById(req.params.id, function (err, setStoreStatus) {
    if(err) { return handleError(res, err); }
    if(!setStoreStatus) { return res.send(404); }
    setStoreStatus.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}