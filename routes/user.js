/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var user_impl = require('./impl/user_impl');
var express = require('express')
var router = express.Router();

module.exports = function(app){
    // 进入注册界面
    router.get( '/regist', user_impl.enterRegist);

    // 注册
    router.post( '/regist', user_impl.regist);

    // 登录
    router.post( '/login', user_impl.login);

    // 根据用户 id 更新用户信息
    router.post( '/update', user_impl.update);

    // 根据用户 id 查询用户信息
    router.post( '/get/:id', user_impl.get);

    // router 命名空间
    app.use('/user', router);
};