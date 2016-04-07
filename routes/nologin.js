/**
 * 开放 的 路由
 * Created by lingyuwang on 2016/4/7.
 */
var nologin_impl = require('./impl/nologin_impl');
var express = require('express')
var router = express.Router();

module.exports = function(app){
    // 进入首页
    router.get('/', nologin_impl.home);

    // 进入注册界面
    router.get( '/regist', nologin_impl.enterRegist);

    // 注册
    router.post( '/regist', nologin_impl.regist);

    // 进入登录界面
    router.get( '/login', nologin_impl.enterLogin);

    // 登录
    router.post( '/login', nologin_impl.login);

    // router 命名空间
    app.use('/', router);
};