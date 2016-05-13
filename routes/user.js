/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var user_impl = require('./impl/user_impl');
var userController = require("../controllers/user");
var express = require('express');
var router = express.Router();

module.exports = function (app) {

    // 根据用户 id 更改密码
    router.put('/pwd/:id', userController.changepassword);

    // 根据 token 登出
    //router.get( '/logout', user_impl.logout);
    router.get('/logout', userController.logout);

    // 根据用户 id 更新用户信息
    router.put('/user/:id', user_impl.update);

    // 根据用户 id 获取用户基本信息
    router.get('/user/:id', user_impl.get);

    // 根据用户 id 获取用户所属资源信息
    router.get('/user/resource/:id', user_impl.getResource);

    // 根据用户 id 获取用户操作日志
    router.get('/user/log/:id', user_impl.getLog);

    // 根据用户 id 修改用户信息
    router.post('/user/:id', userController.changeinfo);

    //获取短信验证码
    router.post('/phone/send/', userController.sendSNSverify);

    //验证短信验证码
    router.post('/phone/verify/', userController.verifySNS);

    // router 命名空间
    app.use('/', router);
};