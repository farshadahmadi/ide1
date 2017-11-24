'use strict';

var express = require('express');
var hostCtrl = require('./visualdevice.controller');

var router = express.Router();

router.get('/', hostCtrl.list);
router.post('/', hostCtrl.create);
router.delete('/:host', hostCtrl.remove);

module.exports = router;
