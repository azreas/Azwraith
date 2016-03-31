/**
 * 镜像路由
 * Created by lingyuwang on 2016/3/29.
 */

var image_impl = require('./impl/image_impl');
var express = require('express')
var router = express.Router();

module.exports = function(app){
    // 获取所有镜像
    app.get( '/list/all', image_impl.listAll);

    // 根据镜像名称获取指定镜像
    app.get( '/get/:name', image_impl.get);

    // router 命名空间
    app.use('/image', router);
};










