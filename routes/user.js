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

    // 进入登录界面
    router.get( '/login', user_impl.enterLogin);

    // 根据用户 id 验证用户是否已登录
    router.get( '/check-login/:id', user_impl.checkLogin);

    // 根据用户 id 更改密码
    router.put( '/pwd/:id', user_impl.updatePwd);

    // 根据用户 id 登出
    router.delete( '/logout/:id', user_impl.logout);

    // 登录
    router.post( '/login', user_impl.login);

    // 根据用户 id 更新用户信息
    router.put( '/user/:id', user_impl.update);

    // 根据用户 id 查询用户信息
    router.get( '/user/:id', user_impl.get);

    // router 命名空间
    app.use('/', router);
};