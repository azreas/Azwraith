/**
 * 镜像路由
 * Created by lingyuwang on 2016/3/29.
 */

var image_impl = require('./impl/image_impl');
var express = require('express')
var router = express.Router();

module.exports = function(app){
    // 获取所有镜像
    router.get( '/list/all', image_impl.listAll);

    // 根据 label 和 kind 获取镜像信息
    router.get( '/list/label/kind', image_impl.listByLabelAndKind);

    // 根据镜像名称获取指定镜像
    router.get( '/get/:name', image_impl.get);

    // 到 docker hub 搜索镜像（返回 json）
    router.get( '/search/:term', image_impl.search);

    // router 命名空间
    app.use('/image', router);
};










