
var Promise = require('promise');
var request = require('request');

var DEVICEMAN_URL = 'http://130.230.142.101:3000';

/**
 * Queries the device manager for devices.
 *
 * Returns a promise.
 */
function queryDevices(query) {
  return new Promise(function(resolve, reject) {
    request({
      method: 'GET',
      url: DEVICEMAN_URL,
      qs: {q: query},
      json: true
    },
    function(err, res, body) {
      if (err) {
        reject(err);
        return;
      }
      var devices = body.map(function(d) {
        return new Device(d);
      });
      resolve(devices);
    });
  });
}

/**
 * A device.
 *
 * Currently has only one method: http(path, opts) that sends a http request
 * using the request library. The opts are forwarded directly to the request library.
 *
 * TODO: more methods.
 *
 */
function Device(dev) {
  this.http = function(path, opts) {
    opts = opts || {};
    if (!opts.url) {
      opts.url = 'http://' + dev.host + ':' + dev.port + path;
    }
    return new Promise(function(resolve, reject) {
      request(opts, function(err, res, body) {
        if (err) {
          reject(err);
          return;
        }
        resolve(body);
      });
    });
  };

  // ???
  this.id = dev.id || dev._id;
  this.classes = dev.classes;
  this.apps = dev.apps;
  this.data = dev;
}

/**
 * A set of devices, got as a result of querying.
 * 
 * Has methods that call the corresponding methods for all of
 * the devices in the set, such as http(path, opts)
 *
 */
function devices(query) {
  var p = queryDevices(query);

  function forEach(f) {
    p.then(function(devices) {
      for (var i=0; i<devices.length; i++) {
        f(devices[i]);
      }
    });
  }

  function callAllDevices(funcName) {
    return function() {
      var args = arguments;
      return p.then(function (devices) {
        var calls = devices.map(function(d) {
          return d[funcName].apply(d, args);
        });
        // Now rejects if one rejects. Probably needs fixing...
        return Promise.all(calls);
      });
    };
  }

  return {
    forEach: forEach,
    http: callAllDevices('http'),
    then: function(f) {
      return p.then(f);
    }
  };
}

exports.devices = devices;
