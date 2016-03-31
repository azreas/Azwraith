/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

/**
 * 创建容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.create = function (request, content, callback){
    var opts = {
        Image: request.body.image, // 镜像名称
        Cmd: request.body.command, // 执行命令
        name: request.body.name // 容器名称
    }
    // 调用 docker api 实现创建容器
    docker.createContainer(opts, function (err, container) {
        var result;
        // 若 container 不为空，则创建成功
        if (container) {
            result = {
                code : "200",
                msg : "创建容器 "+container.id+" 成功"
            }
        } else {
            result = {
                code : "500",
                msg : "创建容器失败，未知错误"
            }
        }
        callback(err, result);
    });
}

/**
 * 删除容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.delete = function (request, content, callback){
    // 调用 docker api 实现删除容器
    var container = docker.getContainer(request.params.id);
    container.remove(function (err, data) {
        var result;
        if (!err && !data) {
            result = {
                code : "200",
                msg : "删除容器成功"
            }
        } else {
            result = {
                code : "500",
                msg : "删除容器失败,"+data
            }
        }
        callback(err, result);
    });
}

/**
 * 根据容器 id 更改容器配置
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.update = function (request, content, callback){
    var opts = {
        BlkioWeight: request.body.BlkioWeight,
        CpuShares: request.body.CpuShares,
        CpuPeriod: request.body.CpuPeriod,
        CpuQuota: request.body.CpuQuota,
        CpusetCpus: request.body.CpusetCpus,
        CpusetMems: request.body.CpusetMems,
        Memory: request.body.Memory,
        MemorySwap: request.body.MemorySwap,
        MemoryReservation: request.body.MemoryReservation,
        KernelMemory: request.body.KernelMemory
    }
    var container = docker.getContainer(request.body.id);
    container.update(opts, function (err, data) {
        var result;
        if (!err && !data) {
            result = {
                code : "200",
                msg : "更新容器成功"
            }
        } else {
            result = {
                code : "500",
                msg : "更新容器失败,"+data
            }
        }
        callback(err, result);
    });
}

/**
 * 获取所有容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.listAll = function (request, content, callback){
    docker.listContainers({all: true}, function (err, containers) {
        var result;
        if (!err) {
            result = {
                code : "200",
                msg : "获取所有容器成功",
                containerList : containers
            }
        } else {
            result = {
                code : "500",
                msg : "获取容器失败,未知错误"
            }
        }
        callback(err, result);
    });
}

/**
 * 根据容器 id 获取指定容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.get = function (request, content, callback){
    var container = docker.getContainer(request.params.id);
    container.inspect(function (err, data) {
        var result;
        if (!err) {
            result = {
                code : "200",
                msg : "获取 "+data.id+" 容器成功",
                container : data
            }
        } else {
            result = {
                code : "500",
                msg : "根据容器 id 获取指定容器失败,未知错误"
            }
        }
        callback(err, result);
    });
}

/**
 * 启动容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.start = function (request, content, callback){
    var container = docker.getContainer(request.params.id);
    container.start(function (err, data) {
        var result;
        if (!err && !data) {
            result = {
                code : "200",
                msg : "启动容器成功"
            }
        } else {
            result = {
                code : "500",
                msg : "启动容器失败,"+data
            }
        }
        callback(err, result);
    });
}

/**
 * 关闭容器
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.stop = function (request, content, callback){
    var container = docker.getContainer(request.params.id);
    container.stop(function (err, data) {
        var result;
        if (!err && !data) {
            result = {
                code : "200",
                msg : "关闭容器成功"
            }
        } else {
            result = {
                code : "500",
                msg : "关闭容器失败,"+data
            }
        }
        callback(err, result);
    });
}






