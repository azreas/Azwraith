/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var container_impl = require('./impl/container_impl');

module.exports = function(rest){
    // 根据镜像创建容器，需要镜像名称
    rest.post( '/container/create', container_impl.create);

    // 根据容器 id 删除容器
    rest.get( '/container/delete/:id', container_impl.delete);

    // 根据容器 id 更改容器配置
    rest.post( '/container/update', container_impl.update);

    // 获取所有容器
    rest.get( '/container/list/all', container_impl.listAll);

    // 根据容器 id 获取指定容器
    rest.get( '/container/get/:id', container_impl.get);

    // 启动容器
    rest.get( '/container/start/:id', container_impl.start);

    // 关闭容器
    rest.get( '/container/stop/:id', container_impl.stop);
};