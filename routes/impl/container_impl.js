/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

var httpUtil = require("../../modules/util/httpUtil");

var dockerservice = require("../../settings").dockerservice;

var dockerConfig = require("../../settings").dockerConfig;

var stringUtil = require("../../modules/util/stringUtil");

var uuid = require('node-uuid');

/**
 * 记录服务事件
 * @param serverEventConfig 服务事件信息
 */
var saveServerEvent = function(serverEventConfig) {
    httpUtil.post({host:dockerservice.host, port:dockerservice.port, path:"/v1/appevent"}, serverEventConfig, function(eventResult){
        try {
            console.log("server event result ---> "+eventResult);
            eventResult = JSON.parse(eventResult);
            console.log("server event result.result ---> "+eventResult.result);

            if (eventResult.result !== true) {
                throw new Error(500);
            }
        } catch (e) {
            console.log(e);
        }
    });
}

/**
 * 记录实例事件
 * @param containerEventConfig 实例事件信息
 */
var saveContainerEvent = function(containerEventConfig) {
    httpUtil.post({host:dockerservice.host, port:dockerservice.port, path:"/v1/containerevent"}, containerEventConfig, function(containerEventResult){
        try {
            console.log("containerEvent result ---> "+containerEventResult);
            containerEventResult = JSON.parse(containerEventResult);
            console.log("containerEvent result.result ---> "+containerEventResult.result);

            if (containerEventResult.result !== true) {
                throw new Error(500);
            }
        } catch (e) {
            console.log(e);
        }
    });
}

/**
 * 保存容器配置信息
 * @param req 请求对象
 * @param res 响应对象
 * @param containersConfig 容器配置信息
 */
var saveContainers = function(req, res, containersConfig) {
    // 根据 token 获取用户id
    httpUtil.get("/v1/auth/"+req.cookies.token, function(tokenResult){
        try {
            console.log("token result ---> "+tokenResult);
            tokenResult = JSON.parse(tokenResult);
            console.log("token result.result ---> "+tokenResult.result);

            // 容器创建成功，保存配置信息
            if (tokenResult.result === true) {
                var uid = tokenResult.id; // 用户id
                containersConfig.owner = uid;
                httpUtil.post({host:dockerservice.host, port:dockerservice.port, path:"/v1/app"}, containersConfig, function(appResult){
                    console.log("app result ---> "+appResult);
                    appResult = JSON.parse(appResult);
                    console.log("app result.result ---> "+appResult.result);

                    // 绑定成功，则返回服务界面，否则抛出 500 错误
                    if (appResult.result === true) {
                        res.redirect("/console");
                    } else {
                        throw new Error(500);
                    }
                });
            } else {
                throw new Error(500);
            }
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
 * 创建容器
 * @param req
 * @param res
 */
exports.create = function (req, res){
    // 容器配置
    var containersConfig = {
        id:uuid.v4(),
        owner:"",
        name: req.body.containerName,
        image: req.body.image,
        imagetag: req.body.imagetag,
        conflevel: "4x",
        instance:parseInt(req.body.instance,10),
        port: [
            {
                "schema": "http",
                "in": "8080",
                "out": "80"
            }
        ],
        container: []
    }
    var opts = null;
    var count = 0; // 创建容器计数器
    for (var i=0; i<containersConfig.instance; i++) {
        opts = {
            Image: req.body.image+":"+req.body.imagetag,
            HostConfig: {
                "PublishAllPorts": true,
            }
        }
        docker.createContainer(opts, function (err, container) {
            if (err) {
                throw new Error(err);
            } else { // 创建成功
                // 启动实例
                container.start(function (err, data) {
                    if (err) {
                        console.log("start container "+container.id+" error :" + err);
                    } else {
                        console.log("container.id ---> "+container.id+"  data ---> "+data);
                    }
                });

                // 保存服务事件（异步）
                saveServerEvent({
                    appid:containersConfig.id,
                    event:"创建成功",
                    titme:new Date().getTime(),
                    script:"Created container:"+container.id
                });

                // 保存实例事件（异步）
                saveContainerEvent({
                    containerid:container.id,
                    title:"创建成功",
                    titme:new Date().getTime(),
                    script:"Created container:"+container.id
                });

                // 获取实例信息，存到容器配置对象
                container.inspect(function (err, data) {
                    try {
                        if (err) {
                            console.log("inspect container "+container.id+" error :" + err);
                            throw new Error(err);
                        } else {
                            var instanceProtocol; // 实例协议
                            var instancePort; // 实例端口
                            var serverHost = dockerConfig.host; // 服务ip
                            var serverPort; // 服务端口
                            var ports = data.NetworkSettings.Ports;
                            for(var p in ports){
                                serverPort = ports[p][0].HostPort;
                                instancePort = p.split("/")[0];
                                instanceProtocol = p.split("/")[1];
                                break;
                            }
                            var serverAdress = serverHost+":"+serverPort; // 服务地址
                            console.log("serverAdress ---> "+serverAdress);

                            var instanceHost = data.NetworkSettings.IPAddress; // 实例ip
                            var instanceAdress = instanceHost+":"+instancePort; // 实例地址
                            console.log("instanceAdress ---> "+instanceAdress);

                            console.log("instanceProtocol ---> "+instanceProtocol);

                            containersConfig.container.push({
                                id:container.id,
                                name:req.body.containerName+"-"+stringUtil.randomString(5),
                                address:instanceAdress,
                                createtime:new Date(data.Created).getTime(),
                                status:"运行中",// 运行状态

                            });
                            count ++;
                            if (count===containersConfig.instance) { // 实例创建并记录配置完成
                                console.log("containersConfig.container.length ---> "+containersConfig.container.length);
                                console.log("containersConfig ---> "+JSON.stringify(containersConfig));
                                // 保存配置
                                saveContainers(req, res, containersConfig);
                            }
                        }
                    } catch (e) {
                        res.status(e.status || 500);
                        res.render('error', {
                            message: e.message,
                            error: e
                        });
                    }
                });
            }
        });
    }
}

/**
 * 删除容器
 * @param req
 * @param res
 */
exports.delete = function (req, res){
    // 调用底层服务接口作删除容器前处理
    //TODO

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
        res.json(result);
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
 * 获取当前用户所属服务列表
 * @param req
 * @param res
 */
exports.listByUid = function (req, res){
    // 根据 token 获取当前用户id
    httpUtil.get("/v1/auth/"+req.cookies.token, function(tokenResult){
        try {
            console.log("token result ---> "+tokenResult);
            tokenResult = JSON.parse(tokenResult);
            console.log("token result.result ---> "+tokenResult.result);

            if (tokenResult.result === true) {
                var uid = tokenResult.id;
                console.log("uid ---> "+uid);
                // 调用底层服务获取服务列表信息
                httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/server/"+uid}, function(result){
                    try {
                        console.log("listByUid result ---> "+result);
                        result = JSON.parse(result);
                        console.log("listByUid result.result ---> "+result.result);

                        // 获取成功，则返回 json 数据
                        if (result.result === true) {
                            res.json(result);
                            //TODO
                        } else { //若失败，则返回包含错误提示的 json 数据
                            res.json(result);
                            //TODO
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log(e);
        }
    });
}

/**
 * 根据容器 id 获取指定容器信息
 * @param req
 * @param res
 */
exports.get = function (req, res){
    // 向底层服务接口发起获取容器基本信息请求
    //httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
        try {
            console.log("get result ---> "+result);
            result = JSON.parse(result);
            console.log("get result.result ---> "+result.result);

            // 获取成功，则返回 json 数据
            if (result.result === true) {
                res.render('detail',{
                    name: result.apps[0].name,
                    image: result.apps[0].image

                });
            } else { //若失败，则返回包含错误提示的 json 数据
                res.json(result);
                //TODO
            }
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
 * 根据容器id获取容器实例列表
 * @param req
 * @param res
 */
exports.listAllInstance = function (req, res){
    // 向底层服务接口发起获取容器实例列表请求
    //TODO

}

/**
 * 根据容器实例id获取容器实例基本信息
 * @param req
 * @param res
 */
exports.getInstance = function (req, res){
    // 向底层服务接口发起获取容器实例基本信息请求
    //TODO

}

/**
 * 根据容器实例id和日期（以天为单位）获取日志
 * @param req
 * @param res
 */
exports.listInstanceAllLog = function (req, res){
    // 向底层服务接口发起获取容器实例日志请求
    //TODO

}

/**
 * 根据容器实例id获取事件列表
 * @param req
 * @param res
 */
exports.listInstanceEventById = function (req, res){
    // 向底层服务接口发起获取容器实例事件请求
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/appevent/"+req.params.id}, function(appEventResult){
        try {
            console.log("appEvent result ---> "+appEventResult);
            appEventResult = JSON.parse(appEventResult);
            console.log("appEvent result.result ---> "+appEventResult.result);

            if (appEventResult.result === true) {
                res.json(appEventResult);
            } else {
                res.json(appEventResult);
            }
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
 * 根据容器id获取绑定域名列表
 * @param req
 * @param res
 */
exports.listAllDomain = function (req, res){
    // 向底层服务接口发起获取绑定域名列表请求
    //TODO

}

/**
 * 根据容器id获取端口列表
 * @param req
 * @param res
 */
exports.listAllPort = function (req, res){
    // 向底层服务接口获取端口列表请求
    //TODO

}

/**
 * 根据容器id和日期（以天为单位）获取日志
 * @param req
 * @param res
 */
exports.listAllLog = function (req, res){
    // 向底层服务接口获取日志请求
    //TODO

}

/**
 * 根据服务id获取事件列表
 * @param req
 * @param res
 */
exports.listAppEventById = function (req, res){
    // 向底层服务接口获取事件列表请求
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/appevent/"+req.params.id}, function(appEventResult){
        try {
            console.log("appEvent result ---> "+appEventResult);
            appEventResult = JSON.parse(appEventResult);
            console.log("appEvent result.result ---> "+appEventResult.result);

            if (appEventResult.result === true) {
                res.json(appEventResult);
            } else {
                res.json(appEventResult);
            }
        } catch (e) {
            console.log(e);
            //TODO
            // 这里应该返回 json 格式的提示
        }
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
        res.json(result);
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
        res.json(result);
    });
}



