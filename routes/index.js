/**
 * index controller
 * Created by lingyuwang on 2016/3/23.
 */

var index_impl = require('./impl/index_impl');

var express = require('express');
var router = express.Router();

module.exports = function(app){

  // 进入控制台（服务界面）
  router.get('/console/:uid', index_impl.console);

  // 测试界面
  router.get('/test', index_impl.test);

  // router 命名空间
  app.use('/', router);
};
