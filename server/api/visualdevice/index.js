'use strict';

var express = require('express');
var hosts = require('./visualdevice.controller');

var router = express.Router();

router.get('/', hosts.list);

module.exports = router;
