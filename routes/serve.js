/**
 * 容器服务 路由
 * Created by lingyuwang on 2016/4/19.
 */

var serve_impl = require('./impl/serve_impl');
var express = require('express');
var router = express.Router();

module.exports = function(app){
    // 创建服务
    router.post( '/create', serve_impl.create);
    
    // router 命名空间
    app.use('/serve', router);
}