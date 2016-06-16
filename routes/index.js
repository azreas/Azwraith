/**
 * index controller
 * Created by lingyuwang on 2016/3/23.
 */

var index_impl = require('./impl/index_impl');

var express = require('express');
var router = express.Router();

module.exports = function (app) {

    // 进入服务中心
    router.get('/servesCenter', index_impl.center);

    // 进入容器服务界面
    router.get('/container', index_impl.container);

    // 进入服务广场界面
    router.get('/square', index_impl.square);

    // 进入服务详情界面
    router.get('/detail/:id', index_impl.detail);

    // 进入创建服务界面
    router.get('/create/:id', index_impl.create);

    // 进入构建镜像界面
    router.get('/build', index_impl.build);

    //进入用户信息页面
    router.get('/account/:id', index_impl.account);

    //进入邮箱验证成功
    router.get('/emailsuccess', index_impl.emailsuccess);

    //进入邮箱验证失败
    router.get('/emailfail', index_impl.emailfail);

    //404页面
    router.get('/notfound', index_impl.notfound);

    //邀请码页面
    router.get('/code', index_impl.code);

    // 测试界面
    // router.get('/test', index_impl.test);

    router.get('/exec', index_impl.test);
    // router 命名空间
    app.use('/', router);
};
