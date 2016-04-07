/**
 * index controller
 * Created by lingyuwang on 2016/3/23.
 */

var index_impl = require('./impl/index_impl');

var express = require('express');
var router = express.Router();

module.exports = function(app){

  router.get('/console/:uid', index_impl.console);

  // router 命名空间
  app.use('/', router);
};
