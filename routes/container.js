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

    // 获取当前用户所属服务列表
    app.get( '/list/:uid', container_impl.listByUid);

    // 根据容器 id 获取指定容器信息
    app.get( '/get/:id', container_impl.get);

    // 根据容器id获取绑定域名列表
    app.get( '/domain/list/all', container_impl.listAllDomain);

    // 根据容器id获取端口列表
    app.get( '/port/list/all', container_impl.listAllPort);

    // 根据容器id和日期（以天为单位）获取日志
    app.get( '/log/list/all', container_impl.listAllLog);

    // 根据容器id获取事件列表
    app.get( '/event/list/all', container_impl.listAllEvent);

    // 启动容器
    app.get( '/start/:id', container_impl.start);

    // 关闭容器
    app.get( '/stop/:id', container_impl.stop);

/********************************** 实例开始 *************************************/
    // 根据容器id获取容器实例列表
    app.get( '/instance/list/all', container_impl.listAllInstance);

    // 根据容器实例id获取容器实例基本信息
    app.get( '/instance/get/:id', container_impl.getInstance);

    // 根据容器实例id和日期（以天为单位）获取日志
    app.get( '/instance/log/list/all', container_impl.listInstanceAllLog);

    // 根据容器实例id获取事件列表
    app.get( '/instance/event/list/all', container_impl.listInstanceAllEvent);
/********************************** 实例结束 *************************************/

    // router 命名空间
    app.use('/container', router);
};