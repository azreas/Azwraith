/**
 * index controller
 * Created by lingyuwang on 2016/3/23.
 */

var index_impl = require('./impl/index_impl');

var express = require('express')
var indexRouter = express.Router();

module.exports = function(app){
  indexRouter.get('/', index_impl.home);



  // router 命名空间
  app.use('/index', indexRouter);
};
