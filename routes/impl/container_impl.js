/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

/**
 * 创建容器
 * @param req
 * @param res
 */
exports.create = function (req, res){
    var opts = {
        Image: req.body.image, // 镜像名称
        Cmd: req.body.command, // 执行命令
        name: req.body.name // 容器名称
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

        // 容器创建成功，绑定用户与容器的关系，传用户id 与 容器id 到后台服务实现绑定
        //TODO

        res.render('index', { title: 'Express' });
    });
}

/**
 * 删除容器
 * @param req
 * @param res
 */
exports.delete = function (req, res){
    // 调用 docker api 实现删除容器
    var container = docker.getContainer(req.params.id);
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
        res.render('index', { title: 'Express' });
    });
}

/**
 * 根据容器 id 更改容器配置
 * @param req
 * @param res
 */
exports.update = function (req, res){
    var opts = {
        BlkioWeight: req.body.BlkioWeight,
        CpuShares: req.body.CpuShares,
        CpuPeriod: req.body.CpuPeriod,
        CpuQuota: req.body.CpuQuota,
        CpusetCpus: req.body.CpusetCpus,
        CpusetMems: req.body.CpusetMems,
        Memory: req.body.Memory,
        MemorySwap: req.body.MemorySwap,
        MemoryReservation: req.body.MemoryReservation,
        KernelMemory: req.body.KernelMemory
    }
    var container = docker.getContainer(req.body.id);
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
        res.render('index', { title: 'Express' });
    });
}

/**
 * 获取所有容器
 * @param req
 * @param res
 */
exports.listAll = function (req, res){
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
        res.render('index', { title: 'Express' });
    });
}

/**
 * 根据用户id获取其所有容器信息
 * @param req
 * @param res
 */
exports.listByUid = function (req, res){
    /*// 根据token获取用户id
    httpUtil.get("/v1/auth/"+req.cookies.token, function(result){
        try {
            console.log("token result ---> "+result);
            result = JSON.parse(result);
            console.log("token result.result ---> "+result.result);

            var uid = result.id;

            // 调用后台服务接口 根据用户id获取其所有容器信息
            //TODO

        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });*/

    httpUtil.get("/.../"+req.params.uid, function(result){
        try {
            console.log("listByUid result ---> "+result);
            result = JSON.parse(result);
            console.log("listByUid result.result ---> "+result.result);
            //TODO
            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}

/**
 * 根据容器 id 获取指定容器
 * @param req
 * @param res
 */
exports.get = function (req, res){
    var container = docker.getContainer(req.params.id);
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
        res.render('index', { title: 'Express' });
    });
}

/**
 * 启动容器
 * @param req
 * @param res
 */
exports.start = function (req, res){
    var container = docker.getContainer(req.params.id);
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
        res.render('index', { title: 'Express' });
    });
}

/**
 * 关闭容器
 * @param req
 * @param res
 */
exports.stop = function (req, res){
    var container = docker.getContainer(req.params.id);
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
        res.render('index', { title: 'Express' });
    });
}






