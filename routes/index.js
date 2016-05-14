/**
 * index controller
 * Created by lingyuwang on 2016/3/23.
 */

var index_impl = require('./impl/index_impl');

var express = require('express');
var router = express.Router();

module.exports = function(app){

  // 进入服务中心
  router.get('/servesCenter',index_impl.center);

  // 进入容器服务界面
  router.get('/container', index_impl.container);

  // 进入代码构建界面
  router.get('/build', index_impl.build);

  // 进入服务广场界面
  router.get('/square', index_impl.square);

  // 服务详情界面
  router.get('/detail/:id',index_impl.detail);

  //进入用户信息页面
  router.get('/account/:id',index_impl.account);

  //进入邮箱验证成功
  router.get('/emailsuccess',index_impl.emailsuccess);

  //进入邮箱验证失败
  router.get('/emailfail',index_impl.emailfail);

  // 测试界面
  router.get('/test', index_impl.test);

  // router 命名空间
  app.use('/', router);
};
