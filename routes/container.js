/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var container_impl = require('./impl/container_impl');
var containerController = require('../controllers/container');
var serverController = require('../controllers/serve');
var express = require('express');
var router = express.Router();

module.exports = function (app) {

    /********************************** 同步请求路由开始 *************************************/
    // 根据镜像创建容器（先创建，后保存信息到数据库）
    //router.post( '/create', container_impl.create);

    // 获取当前用户所属服务列表
    // router.get( '/list', container_impl.listByUid);
    router.get('/list', containerController.listByUid);
    /********************************** 同步请求路由结束 *************************************/


    /********************************** 异步请求路由开始 *************************************/
    // 根据服务 id 创建容器实例
    router.get('/create/:appid', container_impl.create);

    // 根据appid 获取指定服务信息
    router.get('/get/:id', container_impl.get);

    // 根据服务 id 获取所属容器实例列表
    router.get('/list/:appid', containerController.listByAppid);

    //根据服务 id 获取所属容器自动伸缩实例列表
    router.get('/scalecontainer/list/:appid', containerController.findscalecontainer);

    // 根据服务id获取事件列表
    router.get('/app/event/list/:id', container_impl.listAppEventById);

    // 根据服务id启动服务
    router.get('/start/:id', container_impl.start);

    // 根据服务id关闭服务
    router.get('/stop/:id', container_impl.stop);

    // 根据服务 id 删除服务（删除 docker 里的信息）
    router.get('/delete/:id', container_impl.delete);

    // 根据服务 id 将服务放入回收站（逻辑删除）
    // router.get( '/recycle/:id', container_impl.recycle);
    router.get('/recycle/:id', serverController.remove);

    /********************************** 异步请求路由结束 *************************************/

    // 根据容器 id 更改容器配置
    router.post('/update', container_impl.update);

    // 获取所有容器
    router.get('/list/all', container_impl.listAll);

    // 根据容器id获取绑定域名列表30
    router.get('/domain/list/all', container_impl.listAllDomain);

    // 根据容器id获取端口列表
    router.get('/port/list/all', container_impl.listAllPort);

    // 根据容器id和日期（以天为单位）获取日志
    router.get('/log/list/all', container_impl.listAllLog);

    /********************************** 实例开始 *************************************/
    // 根据容器id获取容器实例列表
    router.get('/instance/list/all', container_impl.listAllInstance);

    // 根据服务id和容器实例id获取容器实例基本信息
    router.get('/instance/:appid/:instanceid', container_impl.getInstance);

    // 根据容器实例id和日期（以天为单位）获取日志
    router.get('/instance/log/list/all', container_impl.listInstanceAllLog);

    // 根据容器实例id获取事件列表
    router.get('/instance/event/list/:id', container_impl.listInstanceEventById);

    // 根据容器实例 id 获取日志
    router.get('/inst/log/:instanceid', container_impl.getInstanceLog);

    /********************************** 实例结束 *************************************/

    // router 命名空间
    app.use('/container', router);
};