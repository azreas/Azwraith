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
    console.log("req.body.conflevel ---> "+req.body.conflevel);
    // 容器配置
    var containersConfig = {
        id:uuid.v4(),
        owner:"",
        name: req.body.containerName,
        image: req.body.image,
        imagetag: req.body.imagetag,
        conflevel: req.body.conflevel,
        instance:parseInt(req.body.instance,10),
        address:"",
        createtime:"",
        status:"运行中",// 运行状态
        container: []
    }
    var opts = null;
    var count = 0; // 创建容器计数器
    for (var i=0; i<containersConfig.instance; i++) {
        // 根据配置级别 conflevel 获取配置，然后根据配置创建容器实例
        httpUtil.get({host:"192.168.1.253", port:9000, path:"/v1/setmeal/"+containersConfig.conflevel}, function(levelResult){
            try {
                console.log("level result ---> "+levelResult);
                levelResult = JSON.parse(levelResult);
                console.log("level result.result ---> "+levelResult.result);

                if (levelResult.result === true) {
                    // 获取配置级别参数成功，创建容器实例
                    opts = {
                        Image: req.body.image+":"+req.body.imagetag,
                        HostConfig: {
                            "PublishAllPorts": true,
                            Memory: levelResult.memory*1024*1024,
                            CpuShares: levelResult.cpu*512
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

                                    // 获取实例信息，存到容器配置对象
                                    container.inspect(function (err, data) {
                                        try {
                                            if (err) {
                                                console.log("inspect container "+container.id+" error :" + err);
                                                throw new Error(err);
                                            } else {
                                                // 保存实例事件（异步）
                                                saveContainerEvent({
                                                    containerid:container.id,
                                                    title:"运行成功",
                                                    titme:new Date().getTime(),
                                                    script:"started container:"+container.id
                                                });

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
                                                console.log("serverAddress ---> "+serverHost+":"+serverPort);

                                                var instanceHost = data.NetworkSettings.IPAddress; // 实例ip
                                                console.log("instanceAddress ---> "+instanceHost+":"+instancePort);

                                                console.log("instanceProtocol ---> "+instanceProtocol);

                                                containersConfig.container.push({
                                                    id:container.id,
                                                    outaddress:{
                                                        schema: instanceProtocol,
                                                        ip: serverHost,
                                                        port: serverPort
                                                    },
                                                    inaddress:{
                                                        schema: instanceProtocol,
                                                        ip: instanceHost,
                                                        port: instancePort
                                                    },
                                                    name:req.body.containerName+"-"+stringUtil.randomString(5),
                                                    status:"运行中",// 运行状态
                                                    createtime:new Date(data.Created).getTime(),
                                                });
                                                count ++;
                                                if (count===containersConfig.instance) { // 实例创建并记录配置完成
                                                    console.log("containersConfig.container.length ---> "+containersConfig.container.length);
                                                    console.log("containersConfig ---> "+JSON.stringify(containersConfig));
                                                    // 保存配置
                                                    containersConfig.address = {
                                                        schema: instanceProtocol,
                                                        ip: serverHost,
                                                        port: serverPort
                                                    }; // app 地址（外网地址）
                                                    containersConfig.createtime = new Date().getTime(); // app 创建时间
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
}

/**
 * 根据服务 id 删除服务（删除 docker 里的信息）
 * @param req
 * @param res
 */
exports.delete = function (req, res){
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
        try {
            console.log("get app result ---> "+result);
            result = JSON.parse(result);

            if (result.result === true) {
                // 删除 docker 容器
                var containers = result.apps[0].container;
                var count = 0; // 容器计数器
                var removeFlag = true; // 出错标记
                var script = ""; // 返回信息
                for (var i=0; i<containers.length; i++) {
                    var container = docker.getContainer(containers[i].id);
                    container.remove(function (err, data) {
                        if (err) {
                            removeFlag = false;
                            script += "彻底删除容器实例 "+containers[count].id+" 失败";
                            console.log("彻底删除容器实例 "+containers[count].id+" 失败："+err);
                        }
                        count ++;
                        if (count === containers.length) { // 删除容器结束，返回数据
                            if (removeFlag) {
                                res.json({
                                    result: true,
                                    info: {
                                        code: "10000",
                                        script: "删除服务 "+req.params.id+" 成功"
                                    }
                                });
                            } else {
                                res.json({
                                    result: false,
                                    info: {
                                        code: "00000",
                                        script: "删除服务 "+req.params.id+" 失败："+script
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                throw new Error("获取服务 "+req.params.id+" 信息失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "删除服务失败："+ e.message
                }
            });
        }
    });
}

/**
 * 更新服务信息
 * @param req 请求对象
 * @param res 响应对象
 * @param app 服务对象
 */
var updateApp = function(req, res, app) {
    // 发起更新 app 请求
    httpUtil.put({host:"192.168.1.253", port:9000, path:"/v1/app"}, app, function(updateAppResult){
        try {
            console.log("update app result ---> "+updateAppResult);
            updateAppResult = JSON.parse(updateAppResult);

            if (updateAppResult.result === true) {
                res.json({
                    result: true,
                    info: {
                        code: "10000",
                        script: "将服务 "+app.name+" 放入回收站成功"
                    }
                });
            } else {
                throw new Error("将服务 "+app.name+" 放入回收站失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "将服务放入回收站失败："+ e.message
                }
            });
        }
    });
}

/**
 * 根据服务 id 将服务放入回收站（逻辑删除）
 * @param req
 * @param res
 */
exports.recycle = function (req, res){
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
        try {
            console.log("get app result ---> "+result);
            result = JSON.parse(result);
            console.log("get app result.result ---> "+result.result);

            // 获取成功，则更新删除标识，若服务开着，先进行关闭操作
            if (result.result === true) {
                var app = result.apps[0];
                var containers = app.container;
                var count = 0; // 容器实例计数器
                for (var i=0; i<containers.length; i++) {
                    var container = docker.getContainer(containers[i].id);
                    container.inspect(function (err, data) {
                        if (err) {
                            console.log("获取容器 "+container.id+" 实例信息失败");
                        } else {
                            // 检查容器实例是否关闭，若还没关闭，则进行关闭操作，否则就跳过这操作

                            if (data.State.Running === true) { // 容器实例在跑着，应先关闭实例
                                container.stop(function (err, data) {
                                    if (err) {
                                        console.log("关闭容器 "+container.id+" 实例失败");
                                    }
                                    count ++;
                                    if (count === containers.length) { // 检查到最后一个实例，则进行回收服务
                                        delete app._id; // 删除 _id 属性
                                        app.deleteflag = 1; // 删除标记（0：正常；1：删除；2：审核；3：彻底删除）
                                        updateApp(req, res, app); // 更新服务信息
                                    }
                                });
                            } else {
                                count ++;
                                if (count === containers.length) { // 检查到最后一个实例，则进行回收服务
                                    delete app._id; // 删除 _id 属性
                                    app.deleteflag = 1; // 删除标记（0：正常；1：删除；2：审核；）
                                    updateApp(req, res, app); // 更新服务信息
                                }
                            }

                        }
                    });
                }
            } else {
                throw new Error("没有此app信息，appid "+req.params.id+" 有误");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "将服务放入回收站失败："+ e.message
                }
            });
        }
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
                // 根据配置级别 conflevel 获取配置，然后根据配置创建容器实例
                httpUtil.get({host:"192.168.1.253", port:9000, path:"/v1/setmeal/"+result.apps[0].conflevel}, function(levelResult){
                    try {
                        console.log("level result ---> "+levelResult);
                        levelResult = JSON.parse(levelResult);
                        console.log("level result.result ---> "+levelResult.result);
                        if (levelResult.result === true) {
                            res.render('detail',{
                                memory: levelResult.setneal.memory+"MB",
                                cpu: levelResult.setneal.cpu+"个",
                                name: result.apps[0].name,
                                image: result.apps[0].image,
                                id: result.apps[0].id
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
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.appid}, function(result){
        try {
            console.log("get app result ---> "+result);
            result = JSON.parse(result);
            console.log("get app result.result ---> "+result.result);

            // 获取成功，则根据实例id获取实例基本信息
            if (result.result === true) {
                var app = result.apps[0];
                var containers = app.container;
                var container = null; // 实例
                console.log("实例参数id ---> "+req.params.instanceid);
                for (var i=0; i<containers.length; i++) { // 循环获取实例
                    console.log("实例 "+(i+1)+" id ---> "+containers[i].id);
                    // 若找到实例，则退出
                    if (req.params.instanceid === containers[i].id) {
                        container = containers[i];
                        break;
                    }
                }
                // 若没有找到，则返回提示信息
                if (container === null) {
                    throw new Error(500);
                }
                console.log("app conflevel ---> "+app.conflevel);
                // 根据配置级别 conflevel 获取配置，然后根据配置创建容器实例
                httpUtil.get({host:"192.168.1.253", port:9000, path:"/v1/setmeal/"+app.conflevel}, function(levelResult){
                    try {
                        console.log("level result ---> "+levelResult);
                        levelResult = JSON.parse(levelResult);
                        console.log("level result.result ---> "+levelResult.result);

                        var time = new Date(container.createtime);
                        var date = formatDate(time);

                        if (levelResult.result === true) {
                            // 返回 json 数据
                            res.render('instanceDetail',{
                                container:container,
                                memory:levelResult.setneal.memory+"MB",
                                cpu:levelResult.setneal.cpu,
                                image:app.image,
                                imagetag:app.imagetag,
                                date:date,
                                name: container.name,
                                id: result.apps[0].id,
                                status: container.status,
                                httpout: 'http://'+container.outaddress.ip+':'+container.outaddress.port,
                                httpin: 'http://'+container.inaddress.ip+':'+container.inaddress.port
                            });
                        } else {
                            throw new Error(result.info.script);
                        }

                        function formatDate(now) {
                            var year=now.getFullYear();
                            var month=now.getMonth()+1;
                            var date=now.getDate();
                            var hour=now.getHours();
                            var minute=now.getMinutes();
                            var second=now.getSeconds();
                            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
                        }

                    } catch (e) {
                        console.log("获取容器实例 "+req.params.instanceid+" 失败："+e);
                        res.json({
                            result: false,
                            info: {
                                code: "00000",
                                script: "获取容器实例 "+req.params.instanceid+" 失败"
                            }
                        });
                    }
                });
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log("获取容器实例 "+req.params.instanceid+" 失败："+e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "获取容器实例 "+req.params.instanceid+" 失败"
                }
            });
        }
    });
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
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/containerevent/"+req.params.id}, function(containerEventResult){
        try {
            console.log("containerEvent result ---> "+containerEventResult);
            containerEventResult = JSON.parse(containerEventResult);
            console.log("containerEvent result.result ---> "+containerEventResult.result);

            if (containerEventResult.result === true) {
                res.json(containerEventResult);
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log("获取容器实例事件失败："+e);
            res.json({
                result: true,
                info: {
                    code: "00000",
                    script: "获取容器实例事件失败"
                }
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
 * 根据服务id启动服务
 * @param req
 * @param res
 */
exports.start = function (req, res){
    // 根据服务id，获取容器实例信息，根据容器实例id启动实例
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
        try {
            console.log("get result ---> "+result);
            result = JSON.parse(result);
            console.log("get result.result ---> "+result.result);

            // 获取成功
            if (result.result === true) {
                var serverResult = null; // 返回页面 json
                var count = 0; // 启动容器实例计数器
                var containers = result.apps[0].container;
                for (var i=0; i<containers.length; i++) {
                    var container = docker.getContainer(containers[i].id);
                    container.start(function (err, data) {
                        if (err) {
                            console.log("启动容器实例失败："+err);
                            serverResult = {
                                result: false,
                                info: {
                                    code: "00000",
                                    script: "启动失败"
                                }
                            }
                        }
                        count ++;
                        if (count === containers.length) { // 若容器实例启动完毕，则返回 json
                            if (!(serverResult && !serverResult.result)) { // 若没有实例启动失败，则返回成功提示，否则直接返回
                                serverResult = {
                                    result: true,
                                    info: {
                                        code: "10000",
                                        script: "启动成功"
                                    }
                                }
                            }
                            res.json(serverResult);
                        }
                    });
                }
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log("启动服务失败："+e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "启动失败"
                }
            });
        }
    });
}

/**
 * 停止服务后更新服务信息
 * @param req 请求对象
 * @param res 响应对象
 * @param app 服务对象
 * @param jsonResult 返回的json对象
 */
var stopAfterupdateApp = function(req, res, app, jsonResult) {
    // 发起更新 app 请求
    httpUtil.put({host:"192.168.1.253", port:9000, path:"/v1/app"}, app, function(updateAppResult){
        try {
            console.log("update app result ---> "+updateAppResult);
            updateAppResult = JSON.parse(updateAppResult);

            if (updateAppResult.result === true) {
                res.json(jsonResult);
            } else {
                throw new Error("将服务 "+app.name+" 状态保存失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "服务 "+app.name+" 停止失败："+ e.message
                }
            });
        }
    });
}

/**
 * 根据服务id关闭服务
 * @param req
 * @param res
 */
exports.stop = function (req, res){
    // 根据服务id，获取容器实例信息，根据容器实例id停止实例
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
        try {
            console.log("get app result ---> "+result);
            result = JSON.parse(result);

            // 获取成功
            if (result.result === true) {
                var app = result.apps[0]; // 服务对象
                delete app._id; // 删除 _id 属性
                var count = 0; // 关闭容器实例计数器
                var containers = app.container; // 容器实例数组
                var script = ""; // 异常记录
                var stopContainerFlag = true; // 关闭容器实例成功标记
                for (var i=0; i<containers.length; i++) {
                    var container = docker.getContainer(containers[i].id);
                    container.stop(function (err, data) {
                        if (err) {
                            stopContainerFlag = false;
                            console.log("停止容器实例 "+containers[count].id+" 失败："+err);
                            // 记录异常
                            script += "停止容器实例 "+containers[count].id+" 失败";
                            // 更新容器实例的状态
                            app.container[count].status = "停止失败";
                        }
                        // 更新容器实例的状态
                        app.container[count].status = "已停止";
                        count ++;
                        if (count === containers.length) { // 若容器实例启动完毕，则返回 json
                            var jsonResult = null; // 返回信息
                            if (stopContainerFlag) { // 若没有实例关闭失败，则返回成功提示
                                // 更新服务的状态
                                app.status = "已停止";
                                jsonResult = {
                                    result: true,
                                    info: {
                                        code: "10000",
                                        script: "停止服务 "+req.params.id+" 成功"
                                    },
                                    app : app
                                }
                            } else {
                                // 更新服务的状态
                                app.status = "停止失败";
                                jsonResult = {
                                    result: false,
                                    info: {
                                        code: "00000",
                                        script: "停止服务 "+req.params.id+" 失败："+script
                                    },
                                    app : app
                                }
                            }
                            // 更新 服务 和 容器实例 的状态
                            stopAfterupdateApp(req, res, app, jsonResult);
                        }
                    });
                }
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log("停止服务失败："+e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "停止失败"
                }
            });
        }
    });
}

