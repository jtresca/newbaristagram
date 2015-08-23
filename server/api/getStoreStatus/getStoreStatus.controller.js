'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Store = require('./store');
var Order = require('./orders');
var Store = mongoose.model('Store');

// Get list of getStoreStatus
exports.index = function(req, res) {
  Store.find(function (err, getStoreStatuss) {
    if(err) { return handleError(res, err); }
    return res.json(200, getStoreStatuss);
  });
};

exports.getStoreStatus = function(req, res) {
  return Store.find().sort({date:-1}).limit(1).find(function (err, status) {
    if (!err) {
      return res.json(status);
    } else {
      return res.send(err);
    }
  });
};

// Get a single getStoreStatus
exports.show = function(req, res) {
  Store.findById(req.params.id, function (err, getStoreStatus) {
    if(err) { return handleError(res, err); }
    if(!getStoreStatus) { return res.send(404); }
    return res.json(getStoreStatus);
  });
};

// Creates a new getStoreStatus in the DB.
exports.create = function(req, res) {
  Store.create(req.body, function(err, getStoreStatus) {
    if(err) { return handleError(res, err); }
    return res.json(201, getStoreStatus);
  });
};

// Updates an existing getStoreStatus in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Store.findById(req.params.id, function (err, getStoreStatus) {
    if (err) { return handleError(res, err); }
    if(!getStoreStatus) { return res.send(404); }
    var updated = _.merge(getStoreStatus, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, getStoreStatus);
    });
  });
};

// Deletes a getStoreStatus from the DB.
exports.destroy = function(req, res) {
  Store.findById(req.params.id, function (err, getStoreStatus) {
    if(err) { return handleError(res, err); }
    if(!getStoreStatus) { return res.send(404); }
    getStoreStatus.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}