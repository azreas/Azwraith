/**
 * 镜像路由
 * Created by lingyuwang on 2016/3/29.
 */

var image_impl = require('./impl/image_impl');

module.exports = function(rest){
    // 获取所有镜像
    rest.get( '/image/list/all', image_impl.listAll);

    // 根据镜像名称获取指定镜像
    rest.get( '/image/get/:name', image_impl.get);
};










