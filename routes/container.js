/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var container_impl = require('./impl/container_impl');
var express = require('express')
var router = express.Router();

module.exports = function(app){
    // 根据镜像创建容器，需要镜像名称
    app.post( '/create', container_impl.create);

    // 根据容器 id 删除容器
    app.get( '/delete/:id', container_impl.delete);

    // 根据容器 id 更改容器配置
    app.post( '/update', container_impl.update);

    // 获取所有容器
    app.get( '/list/all', container_impl.listAll);

    // 根据用户id获取其所有容器信息
    app.get( '/list/:uid', container_impl.listByUid);

    // 根据容器 id 获取指定容器
    app.get( '/get/:id', container_impl.get);

    // 启动容器
    app.get( '/start/:id', container_impl.start);

    // 关闭容器
    app.get( '/stop/:id', container_impl.stop);

    // router 命名空间
    app.use('/container', router);
};