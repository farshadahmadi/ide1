/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/visualdevices              ->  index
 */

'use strict';

var kubernetes = require("./kubernetes-api-caller.js");
var errorHandler = require('../common').errorHandler;

// Gets a list of hosts
exports.list = function (req, res) {
  kubernetes.getHosts().then(function(hosts){
    console.log(hosts);
    res.status(200).send(hosts);
  }).catch(errorHandler(res));
}
