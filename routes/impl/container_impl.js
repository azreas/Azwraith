/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

var rest = require('restler');

var httpUtil = require("../../modules/util/httpUtil");

var dockerservice = require("../../settings").dockerservice;

var dockerConfig = require("../../settings").dockerConfig;

var stringUtil = require("../../modules/util/stringUtil");

var uuid = require('node-uuid');

var http = require('http');

var async = require("async");


/**
 * 根据 容器实例id 更新信息
 * @param app 服务对象
 * @param containerId 容器id
 * @param pname 属性名
 * @param pvalue 属性值
 */
var updateAppContainer = function (app, containerId, pname, pvalue) {
    for (var i = 0; i < app.container.length; i++) {
        if (app.container[i].id === containerId) {
            app.container[i][pname] = pvalue;
            break;
        }
    }
};

/**
 * 记录服务事件
 * @param serverEventConfig 服务事件信息
 */
var saveServerEvent = function (serverEventConfig) {
    httpUtil.post({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/appevent"
    }, serverEventConfig, function (eventResult) {
        try {
            console.log("server event result ---> " + eventResult);
            eventResult = JSON.parse(eventResult);
            console.log("server event result.result ---> " + eventResult.result);

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
var saveContainerEvent = function (containerEventConfig) {
    httpUtil.post({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/appevent"
    }, containerEventConfig, function (containerEventResult) {
        try {
            console.log("containerEvent result ---> " + containerEventResult);
            containerEventResult = JSON.parse(containerEventResult);
            console.log("containerEvent result.result ---> " + containerEventResult.result);

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
/*var saveContainers = function(req, res, containersConfig) {
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
 }*/

/**
 * 根据服务 id 创建容器实例
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    /****************************** 步骤开始 *********************************/
    // 1.根据服务 id 获取服务信息
    // 2.根据配置级别 conflevel 获取配置

    // 3.检查镜像是否已存在，若不存在，则先 pull 一个

    /*********************** 循环开始 **************************/
    // 4.创建容器实例，若失败，则记录失败事件到服务事件里，然后结束“这条线”
    // 5.存储容器实例创建成功事件（服务和容器实例都要记，不管事件保存成功与否都进行下一步）
    // 6.启动实例
    // 7.存储容器实例启动成功或失败事件（不管事件保存成功与否都进行下一步），若是启动失败，则直接结束“这条线”
    // 8.获取实例信息，存到容器配置对象
    // 9.存储容器配置对象
    /*********************** 循环结束 **************************/

    // 10.若有实例启动成功，则映射子域名
    // 11.根据容器实例创建情况，更新服务状态和时间信息
    // 12.存储服务事件（运行事件，异步，不管成功与否）
    /****************************** 步骤结束 *********************************/
    try {
        var app = null; // 服务对象
        var level = {}; // 容器配置级别
        async.waterfall([
            function (callback) { // 根据服务 id 获取服务信息
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app/" + req.params.appid
                }, function (appResult) {
                    try {
                        console.log("app result ---> " + appResult);
                        appResult = JSON.parse(appResult);

                        if (appResult.result !== true) {
                            // 直接跳到返回结果函数，进行异常处理
                            callback(appResult.info.script);
                            return;
                        }
                        app = appResult.apps[0];
                        delete app._id; // 删除 _id 属性
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e); // 直接跳到返回结果函数，进行异常处理
                    }
                });
            }, function (callback) { // 根据配置级别 conflevel 获取配置
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/setmeal/" + app.conflevel
                }, function (levelResult) {
                    try {
                        console.log("level result ---> " + levelResult);
                        levelResult = JSON.parse(levelResult);

                        if (levelResult.result !== true) {
                            // 直接跳到返回结果函数，进行异常处理
                            callback(levelResult.info.script);
                            return;
                        }
                        level.memory = levelResult.setneal.memory * 1024 * 1024,
                            level.cpu = levelResult.setneal.cpu
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e); // 直接跳到返回结果函数，进行异常处理
                    }
                });
            }, function (callback) { // 检查镜像是否已存在，若不存在，则先 pull 一个
                console.log("检查镜像是否已存在，若不存在，则先 pull 一个 ...");
                callback(null); // 触发下一步
            }, function (callback) { // 循环创建容器实例
                var containerCounter = 0; // 创建容器实例计数器
                var containerSuccessCounter = 0; // 创建容器实例成功计数器
                // 创建容器方法
                var createContainerFun = function (outcreatecallback) {
                    var containerOpts = {
                        Image: app.image + ":" + app.imagetag,
                        Labels: {
                            "interlock.hostname": app.subdomain,
                            "interlock.domain": dockerConfig.domain
                        },
                        HostConfig: {
                            PublishAllPorts: true,
                            MemoryReservation: level.memory,
                            // CpuShares:level.cpu,
                            NetworkMode: app.network,
                            RestartPolicy: {
                                Name: "unless-stopped"
                            }
                        }
                    }
                    async.waterfall([
                        function (createcallback) { // 创建容器实例
                            rest.postJson('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/create', containerOpts).on('complete', function (data, response) {
                                try {
                                    if (response.statusCode !== 201) {
                                        console.log("创建容器实例失败：" + JSON.stringify(data));
                                        throw new Error("创建容器实例失败");
                                    }
                                    console.log("容器实例 " + data.Id + " 创建成功");
                                    createcallback(null, data.Id); // 触发下一步，并传容器实例id
                                } catch (e) {
                                    createcallback(e);
                                }
                            });
                        }, function (containerid, createcallback) { // 存储容器实例创建成功事件（不管事件保存成功与否都进行下一步）
                            var containerEventConfig = {
                                containerid: containerid,
                                title: "创建成功",
                                titme: new Date().getTime(),
                                script: "create container:" + containerid
                            };
                            httpUtil.post({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/containerevent"
                            }, containerEventConfig, function (containerEventResult) {
                                try {
                                    console.log("create containerEvent result ---> " + containerEventResult);
                                    containerEventResult = JSON.parse(containerEventResult);

                                    console.log("容器实例 " + containerEventConfig.containerid + " 保存创建事件情况：" + containerEventResult.info.script);
                                } catch (e) {
                                    console.log("容器实例 " + containerEventConfig.containerid + " 保存创建事件失败：" + e);
                                }
                            });
                            createcallback(null, containerid); // 触发下一步，不管事件保存成功与否
                        }, function (containerid, createcallback) { // 启动实例
                            rest.postJson('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + containerid + '/start').on('complete', function (data, response) {
                                try {
                                    if (response.statusCode !== 204) {
                                        console.log("启动容器实例 " + containerid + " 失败：" + data);
                                        createcallback(null, containerid, data);
                                        return;
                                    }
                                    createcallback(null, containerid, null);
                                } catch (e) {
                                    createcallback(e);
                                }
                            });
                        }, function (containerid, err, createcallback) { // 存储容器实例启动成功或失败事件，若失败，则直接结束“这条线”
                            var eventTitle = "";
                            var script;
                            var time = new Date().getTime();
                            var containerEventConfig = {
                                containerid: containerid,
                                title: "",
                                titme: time,
                                script: ""
                            };
                            if (!err) {
                                eventTitle = "启动成功";
                                script = "start container " + containerid + " success";
                                containerEventConfig.title = eventTitle;
                                containerEventConfig.script = script;
                                httpUtil.post({
                                    host: dockerservice.host,
                                    port: dockerservice.port,
                                    path: "/v1/containerevent"
                                }, containerEventConfig, function (containerEventResult) {
                                    try {
                                        console.log("start containerEvent result ---> " + containerEventResult);
                                        containerEventResult = JSON.parse(containerEventResult);

                                        console.log("容器实例 " + containerEventConfig.containerid + " 保存" + eventTitle + "事件情况：" + containerEventResult.info.script);
                                    } catch (e) {
                                        console.log("容器实例 " + containerEventConfig.containerid + " 保存" + eventTitle + "事件失败：" + e);
                                    }
                                });
                            } else {
                                eventTitle = "启动失败";
                                script = "start container " + containerid + " error";
                            }
                            var serverEventConfig = {
                                appid: app.id,
                                event: eventTitle,
                                titme: time,
                                script: script
                            };
                            httpUtil.post({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/appevent"
                            }, serverEventConfig, function (eventResult) {
                                try {
                                    console.log("server event result ---> " + eventResult);
                                    eventResult = JSON.parse(eventResult);

                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                                } catch (e) {
                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                                }
                            });
                            if (err) { // 若启动失败，则直接结束“这条线”
                                createcallback(err);
                                return;
                            }
                            createcallback(null, containerid); // 触发下一步，并传容器实例id
                        }, function (containerid, createcallback) { // 获取实例信息
                            rest.get('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + containerid + '/json').on('complete', function (data, response) {
                                try {
                                    if (response.statusCode !== 200) {
                                        console.log("获取容器实例 " + containerid + " 信息失败：" + data);
                                        throw new Error(data);
                                    }

                                    var instanceProtocol; // 实例协议
                                    var instancePort; // 实例端口
                                    var serverHost; // 服务ip
                                    var serverPort; // 服务端口
                                    var ports = data.NetworkSettings.Ports;
                                    for (var p in ports) {
                                        serverPort = ports[p][0].HostPort;
                                        instancePort = p.split("/")[0];
                                        instanceProtocol = p.split("/")[1];
                                        break;
                                    }
                                    serverHost = data.Node.IP;
                                    console.log("serverAddress ---> " + serverHost + ":" + serverPort);
                                    var networkName = app.network;

                                    var instanceHost = data.NetworkSettings.Networks[networkName].IPAddress; // 实例ip
                                    console.log("instanceAddress ---> " + instanceHost + ":" + instancePort);

                                    console.log("instanceProtocol ---> " + instanceProtocol);

                                    var containerConfig = {
                                        id: containerid,
                                        appid: app.id,
                                        outaddress: {
                                            schema: instanceProtocol,
                                            ip: serverHost,
                                            port: serverPort
                                        },
                                        inaddress: {
                                            schema: instanceProtocol,
                                            ip: instanceHost,
                                            port: instancePort
                                        },
                                        name: app.name + "-" + stringUtil.randomString(5),
                                        status: 2,// // 容器实例状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                                        createtime: new Date(data.Created).getTime(),
                                    };
                                    createcallback(null, containerConfig); // 触发下一步，并传容器配置对象
                                } catch (e) {
                                    createcallback(e);
                                }
                            });
                        }, function (containerConfig, createcallback) { // 存储容器配置对象
                            httpUtil.post({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/container"
                            }, containerConfig, function (result) {
                                try {
                                    console.log("save container result ---> " + result);
                                    result = JSON.parse(result);

                                    if (result.result !== true) {
                                        throw new Error(result.info.script);
                                    }
                                    createcallback(null); // 触发下一步
                                } catch (e) {
                                    console.log("容器实例 " + containerConfig.id + " 保存配置失败：" + e);
                                    createcallback(e);
                                }
                            });
                        }
                    ], function (err, result) {
                        containerCounter++;
                        if (err) {
                            console.log(err);
                            outcreatecallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例创建失败");
                            return;
                        }
                        containerSuccessCounter++;
                        outcreatecallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例创建成功");
                    });
                };

                var createContainerArray = [];
                // 根据实例个数，得到创建实例数组
                for (var i = 0; i < app.instance; i++) {
                    createContainerArray[i] = createContainerFun;
                }

                async.parallel(
                    createContainerArray,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("服务 " + app.name + " 有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例创建成功");
                        console.log(results);
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                    }
                );
            }, function (containerSuccessCounter, callback) { // 若有实例启动成功，则映射子域名
                if (containerSuccessCounter <= 0) {
                    callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                } else {
                    httpUtil.post({
                        host: dockerservice.host,
                        port: dockerservice.port,
                        path: "/v1/domain"
                    }, {subdomain: app.subdomain}, function (result) {
                        try {
                            console.log("domain result ---> " + result);
                            result = JSON.parse(result);

                            if (result.result !== true) {
                                throw new Error("映射服务 " + app.name + " 网络失败");
                            }
                            callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                        } catch (e) {
                            callback(e);
                        }
                    });
                }
            }, function (containerSuccessCounter, callback) { // 根据容器实例创建情况，更新服务配置信息
                console.log("根据容器实例创建情况，更新服务配置信息 ...");
                if (containerSuccessCounter <= 0) { // 表示服务启动失败，更新状态为：5.启动失败
                    app.status = 5;
                } else { // 表示服务启动成功，更新状态为：2.运行中
                    app.status = 2;
                }
                app.updatetime = new Date().getTime();
                app.address = app.subdomain + "." + dockerConfig.domain;
                httpUtil.put({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app"
                }, app, function (updateAppResult) {
                    try {
                        console.log("update app result ---> " + updateAppResult);
                        updateAppResult = JSON.parse(updateAppResult);

                        if (updateAppResult.result !== true) {
                            throw new Error("更新服务 " + app.name + " 状态失败");
                        }
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (containerSuccessCounter, callback) { // 存储服务事件（运行事件，异步，不管成功与否）
                var serverEventConfig = {
                    appid: app.id,
                    event: "",
                    titme: new Date().getTime(),
                    script: ""
                }
                if (containerSuccessCounter <= 0) { // 表示服务启动失败，存储服务启动失败事件
                    serverEventConfig.event = "服务启动失败";
                    serverEventConfig.script = "启动服务 " + app.name + "失败";
                } else { // 表示服务启动成功，存储服务运行中事件
                    serverEventConfig.event = "运行中";
                    serverEventConfig.script = "启动服务 " + app.name + "成功，共有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例启动成功";
                }
                httpUtil.post({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/appevent"
                }, serverEventConfig, function (eventResult) {
                    try {
                        console.log("server event result ---> " + eventResult);
                        eventResult = JSON.parse(eventResult);

                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                    } catch (e) {
                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                    }
                });
                if (containerSuccessCounter <= 0) { // 服务启动失败
                    callback("没有实例启动成功");
                } else { // 表示服务启动成功，触发下一步
                    callback(null);
                }
            }
        ], function (err, result) {
            if (err) {
                console.log("根据服务 " + req.params.appid + " 创建容器实例失败：" + err);
                res.json({
                    result: false,
                    info: {
                        code: "00000",
                        script: "根据服务 " + req.params.appid + " 创建容器实例失败：" + err
                    }
                });
            } else {
                console.log("根据服务 " + req.params.appid + " 创建容器实例成功");
                res.json({
                    result: true,
                    info: {
                        code: "10000",
                        script: "根据服务 " + req.params.appid + " 创建容器实例成功"
                    }
                });
            }
        });
    } catch (e) {
        console.log("根据服务 " + req.params.appid + " 创建容器实例失败：" + e);
        res.json({
            result: false,
            info: {
                code: "00000",
                script: "根据服务 " + req.params.appid + " 创建容器实例失败：" + e
            }
        });
    }
}

/**
 * 创建容器
 * @param req
 * @param res
 */
/*exports.create = function (req, res){
 // 1.根据配置级别 conflevel 获取配置，然后根据配置创建容器实例
 // 2.创建容器实例
 // 3.创建成功，启动实例
 // 4.获取实例信息，存到容器配置对象
 // 5.保存实例事件（异步）
 // 6.所有实例创建成功且获取到配置信息后，保存容器配置信息

 // 容器配置
 var containersConfig = {
 id:uuid.v4(),
 owner:"",
 name: req.body.containerName,
 image: req.body.image,
 imagetag: req.body.imagetag ? req.body.imagetag : "latest",
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
 httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/setmeal/"+containersConfig.conflevel}, function(levelResult){
 try {
 console.log("level result ---> "+levelResult);
 levelResult = JSON.parse(levelResult);

 if (levelResult.result === true) {
 // 获取配置级别参数成功，创建容器实例
 opts = {
 Image: containersConfig.image+":"+containersConfig.imagetag,
 HostConfig: {
 PublishAllPorts: true,
 Memory: levelResult.memory*1024*1024,
 CpuShares: levelResult.cpu*512
 }
 }
 docker.createContainer(opts, function (err, container) {
 try {
 if (err) {
 throw new Error(err);
 }
 // 创建成功，启动实例
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
 } catch (e) {
 res.status(e.status || 500);
 res.render('error', {
 message: e.message,
 error: e
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
 }*/

/**
 * 根据服务 id 删除服务（删除 docker 里的信息）
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/app/" + req.params.id
    }, function (result) {
        try {
            console.log("get app result ---> " + result);
            result = JSON.parse(result);

            if (result.result === true) {
                // 删除 docker 容器
                var containers = result.apps[0].container;
                var count = 0; // 容器计数器
                var removeFlag = true; // 出错标记
                var script = ""; // 返回信息
                for (var i = 0; i < containers.length; i++) {
                    var container = docker.getContainer(containers[i].id);
                    container.remove(function (err, data) {
                        if (err) {
                            removeFlag = false;
                            script += "彻底删除容器实例 " + containers[count].id + " 失败";
                            console.log("彻底删除容器实例 " + containers[count].id + " 失败：" + err);
                        }
                        count++;
                        if (count === containers.length) { // 删除容器结束，返回数据
                            if (removeFlag) {
                                res.json({
                                    result: true,
                                    info: {
                                        code: "10000",
                                        script: "删除服务 " + req.params.id + " 成功"
                                    }
                                });
                            } else {
                                res.json({
                                    result: false,
                                    info: {
                                        code: "00000",
                                        script: "删除服务 " + req.params.id + " 失败：" + script
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                throw new Error("获取服务 " + req.params.id + " 信息失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "删除服务失败：" + e.message
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
var updateApp = function (req, res, app) {
    // 发起更新 app 请求
    httpUtil.put({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/app"
    }, app, function (updateAppResult) {
        try {
            console.log("update app result ---> " + updateAppResult);
            updateAppResult = JSON.parse(updateAppResult);

            if (updateAppResult.result === true) {
                res.json({
                    result: true,
                    info: {
                        code: "10000",
                        script: "将服务 " + app.name + " 放入回收站成功"
                    },
                    app: app
                });
            } else {
                throw new Error("将服务 " + app.name + " 放入回收站失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "将服务放入回收站失败：" + e.message
                },
                app: app
            });
        }
    });
}

/**
 * 根据服务 id 将服务放入回收站（docker物理删除，数据库逻辑删除）
 * @param req
 * @param res
 */
exports.recycle = function (req, res) {
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/containers/" + req.params.id
    }, function (result) {
        try {
            console.log("get app result ---> " + result);
            result = JSON.parse(result);
            if (result.result === true) {
                var containers = result.containers;
                var count = 0; //删除容器计数器
                var delcontainerFun = function (calldelback) {//创建异步方程组
                    var containerid = containers[count].id;
                    count++;
                    rest.del('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + containerid + '?v=1&force=1').on('complete', function (result, response) {
                        try {
                            if (response.statusCode == 204) {
                                console.log("删除容器 " + containerid + " 成功");
                                calldelback(null, "删除容器" + containerid + "成功")
                            } else {
                                // console.log("删除容器失败");
                                calldelback("删除容器 " + containerid + "失败")
                            }
                        } catch (e) {
                            calldelback(e);
                        }
                    });
                };
                async.waterfall([//方法组依次执行
                    function (callback) {//删除容器
                        var delcontainerFus = [];
                        for (var i = 0; i < containers.length; i++) {
                            delcontainerFus[i] = delcontainerFun;
                        }
                        async.parallel(//调用异步方程组
                            delcontainerFus
                            , function (err, datas) {
                                if (err) {
                                    console.log("error ---> " + err);
                                    callback(err);
                                } else {
                                    console.log(datas);
                                    callback(null);
                                }
                            });
                    }, function (callback) {// 删除网络
                        //获取网络ID
                        rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/app/' + req.params.id).on('complete', function (result) {
                            if (result.result === true) {
                                var networkid = result.apps[0].networkid;
                                //删除容器相关网络
                                rest.del('http://' + dockerConfig.host + ':' + dockerConfig.port + '/networks/' + networkid).on('complete', function (result, response) {
                                    if (response.statusCode == 204) {
                                        console.log("删除网络成功");
                                        callback(null);
                                    }
                                    else {
                                        console.log("删除网络失败");
                                        callback("删除网络失败");
                                    }
                                });
                            }
                        });
                    }, function (callback) {//数据库APP标记为已删除
                        rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/app/' + req.params.id).on('complete', function (result) {
                            if (result.result === true) {
                                var app = {
                                    "id": result.apps[0].id,
                                    "owner": result.apps[0].owner,
                                    "name": result.apps[0].name,
                                    "image": result.apps[0].image,
                                    "imagetag": result.apps[0].imagetag,
                                    "conflevel": result.apps[0].conflevel,
                                    "instance": result.apps[0].instance,
                                    "expandPattern": result.apps[0].expandPattern,
                                    "command": result.apps[0].command,
                                    "network": result.apps[0].network,
                                    "networkid": result.apps[0].networkid,
                                    "subdomain": result.apps[0].subdomain,
                                    "status": result.apps[0].status,
                                    "createtime": result.apps[0].createtime,
                                    "updatetime": new Date().getTime(),
                                    "deleteFlag": 1
                                };
                                rest.putJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/app', app).on('complete', function (data, response) {
                                    if (data.result === true) {
                                        console.log("数据库APP标记为已删除成功");
                                        callback(null);
                                    } else {
                                        console.log("数据库APP标记为已删除失败");
                                        callback("数据库APP标记为已删除失败");
                                    }
                                });
                            }
                        });
                    }], function (error, results) {
                    if (error) {
                        console.log("error ---> " + error);
                        res.json({result: false});
                    } else {
                        res.json({result: true});
                    }
                });
            } else {
                res.json({result: false});
                throw new Error("没有此app信息，appid " + req.params.id + " 有误");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "将服务 " + req.params.id + " 放入回收站失败：" + e.message
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
exports.update = function (req, res) {
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
                code: "200",
                msg: "更新容器成功"
            }
        } else {
            result = {
                code: "500",
                msg: "更新容器失败," + data
            }
        }
        res.render('index', {title: 'Express'});
    });
}

/**
 * 获取所有容器
 * @param req
 * @param res
 */
exports.listAll = function (req, res) {
    docker.listContainers({all: true}, function (err, containers) {
        var result;
        if (!err) {
            result = {
                code: "200",
                msg: "获取所有容器成功",
                containerList: containers
            }
        } else {
            result = {
                code: "500",
                msg: "获取容器失败,未知错误"
            }
        }
        res.render('index', {title: 'Express'});
    });
}

/**
 * 获取当前用户所属服务列表
 * @param req
 * @param res
 */
exports.listByUid = function (req, res) {
    async.waterfall([
        function (callback) { // 根据 token 获取当前用户id
            httpUtil.get("/v1/auth/" + req.cookies.token, function (tokenResult) {
                try {
                    console.log("token result ---> " + tokenResult);
                    tokenResult = JSON.parse(tokenResult);

                    if (tokenResult.result !== true) {
                        throw new Error(tokenResult.info.script);
                    }
                    callback(null, tokenResult.id); // 触发下一步，并传用户 id
                } catch (e) {
                    callback(e);
                }
            });
        },
        function (uid, callback) { // 调用底层服务获取服务列表信息
            httpUtil.get({
                host: dockerservice.host,
                port: dockerservice.port,
                path: "/v1/server/" + uid
            }, function (result) {
                try {
                    console.log("listByUid result ---> " + result);
                    result = JSON.parse(result);

                    // 获取成功，则返回 json 数据
                    if (result.result !== true) {
                        throw new Error(tokenResult.info.script);
                    }
                    callback(null, result);
                } catch (e) {
                    callback(e);
                }
            });
        }
    ], function (err, result) {
        if (err) {
            console.log("获取当前用户所属服务列表失败：" + err);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "获取当前用户所属服务列表失败"
                }
            });
            return;
        }
        res.json(result);
    });
}

/**
 * 根据容器 id 获取指定容器信息
 * @param req
 * @param res
 */
exports.get = function (req, res) {
    // 向底层服务接口发起获取容器基本信息请求
    //httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/app/"+req.params.id}, function(result){
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/app/" + req.params.id
    }, function (result) {
        try {
            console.log("get result ---> " + result);
            result = JSON.parse(result);
            console.log("get result.result ---> " + result.result);

            var env = result.app.env;
            var envSplit = [];
            for (var i in env) {
                envSplit[i] = env[i].split("=");
            }
            // 获取成功，则返回 json 数据
            if (result.result === true) {
                // 根据配置级别 conflevel 获取配置，然后根据配置创建容器实例
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/setmeal/" + result.app.conflevel
                }, function (levelResult) {
                    try {
                        console.log("level result ---> " + levelResult);
                        levelResult = JSON.parse(levelResult);
                        console.log("level result.result ---> " + levelResult.result);
                        if (levelResult.result === true) {
                            var resultData = {
                                memory: levelResult.data.memory + "MB",
                                cpu: levelResult.data.cpu + "个",
                                name: result.app.name,
                                iamgeName: result.app.image,
                                image: result.app.image + ':' + result.app.imagetag,
                                id: result.app.id,
                                status: result.app.status,
                                address: result.app.address,
                                updateTime: result.app.updatetime,
                                createTime: result.app.createtime,
                                environment: envSplit
                            };
                            res.json(resultData);
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
 * 根据服务 id 获取所属容器实例列表
 * @param req
 * @param res
 */
exports.listByAppid = function (req, res) {
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/containers/" + req.params.appid
    }, function (result) {
        try {
            console.log("containers list by appid result ---> " + result);
            result = JSON.parse(result);

            if (result.result !== true) {
                throw new Error(result.info.script);
            }
            res.json(result);
        } catch (e) {
            console.log("根据服务 " + req.params.appid + " 获取所属容器实例列表失败：" + e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "根据服务 " + req.params.appid + " 获取所属容器实例列表失败"
                }
            });
        }
    });
}

/**
 * 根据容器id获取容器实例列表
 * @param req
 * @param res
 */
exports.listAllInstance = function (req, res) {
    // 向底层服务接口发起获取容器实例列表请求
    //TODO

}

/**
 * 根据服务id和容器实例id获取容器实例基本信息
 * @param req
 * @param res
 */
exports.getInstance = function (req, res) {
    async.waterfall([
        function (callback) { // 根据服务 id 获取服务信息
            httpUtil.get({
                host: dockerservice.host,
                port: dockerservice.port,
                path: "/v1/app/" + req.params.appid
            }, function (result) {
                try {
                    console.log("get app result ---> " + result);
                    result = JSON.parse(result);

                    if (result.result !== true) {
                        throw new Error(result.info.script);
                    }
                    var app = result.app; //服务相关信息
                    callback(null, app); // 触发下一步，并传 app
                } catch (e) {
                    callback(e);
                }
            });
        }, function (app, callback) { // 根据配置级别 conflevel 获取配置
            httpUtil.get({
                host: dockerservice.host,
                port: dockerservice.port,
                path: "/v1/setmeal/" + app.conflevel
            }, function (levelResult) {
                try {
                    console.log("level result ---> " + levelResult);
                    levelResult = JSON.parse(levelResult);  //配置级别相关信息
                    if (levelResult.result === true) {
                        // 返回 json 数据
                        callback(null, app, levelResult);
                    } else {
                        throw new Error(result.info.script);
                    }
                } catch (e) {
                    console.log("获取配置信息 " + app.conflevel + " 失败：" + e);
                    res.json({
                        result: false,
                        info: {
                            code: "00000",
                            script: "获取配置信息 " + app.conflevel + " 失败"
                        }
                    });
                    callback(e);
                }
            });
        }, function (app, levelresult, callback) { // 根据容器实例id获取容器实例基本信息
            httpUtil.get({
                host: dockerservice.host,
                port: dockerservice.port,
                path: "/v1/container/" + req.params.instanceid
            }, function (containerResult) {
                try {
                    console.log("containerResult  ---> " + containerResult);
                    containerResult = JSON.parse(containerResult);  //容器实例相关信息
                    if (containerResult.result === true) {
                        // 返回 json 数据
                        callback(null, app, levelresult, containerResult);
                    } else {
                        throw new Error(result.info.script);
                    }
                } catch (e) {
                    console.log("获取容器实例 " + req.params.instanceid + " 失败：" + e);
                    res.json({
                        result: false,
                        info: {
                            code: "00000",
                            script: "获取容器实例 " + req.params.instanceid + " 失败"
                        }
                    });
                }
            });
        }, function (app, levelresult, containerResult, callback) { // 根据容器实例id获取容器实例事件信息
            httpUtil.get({
                host: dockerservice.host,
                port: dockerservice.port,
                path: "/v1/containerevent/" + req.params.instanceid
            }, function (containerEventResult) {
                try {
                    console.log("containerEventResult  ---> " + containerEventResult);
                    containerEventResult = JSON.parse(containerEventResult);  //容器实例事件相关信息

                    var time = new Date(containerResult.container.createtime);
                    var date = formatDate(time);
                    var env = app.env;
                    var envSplit = [];
                    for (var i in env) {
                        envSplit[i] = env[i].split("=");
                    }

                    function formatDate(now) {
                        var year = now.getFullYear();
                        var month = now.getMonth() + 1;
                        var date = now.getDate();
                        var hour = now.getHours();
                        var minute = now.getMinutes();
                        var second = now.getSeconds();
                        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                    }

                    if (containerEventResult.result === true) {
                        // 返回 json 数据
                        var status = "";
                        switch (containerResult.container.status) {
                            //1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                            case 1:
                                status = "启动中";
                                break;
                            case 2:
                                status = "运行中";
                                break;
                            case 3:
                                status = "停止中";
                                break;
                            case 4:
                                status = "已停止";
                                break;
                            case 5:
                                status = "启动失败";
                                break;
                            case 6:
                                status = "停止失败";
                                break;
                        }
                        res.render('instanceDetail', {
                            containerId: req.params.instanceid,
                            memory: levelresult.data.memory + "MB",
                            cpu: levelresult.data.cpu,
                            image: app.image,
                            imagetag: app.imagetag,
                            date: date,
                            name: containerResult.container.name,
                            status: status,
                            httpout: 'http://' + containerResult.container.outaddress.ip + ':' + containerResult.container.outaddress.port,
                            httpin: 'http://' + containerResult.container.inaddress.ip + ':' + containerResult.container.inaddress.port,
                            containerEvents: containerEventResult.containerevents,
                            environment: envSplit
                        });
                    } else {
                        throw new Error(result.info.script);
                    }
                } catch (e) {
                    console.log("获取容器实例事件 " + req.params.instanceid + " 失败：" + e);
                    res.json({
                        result: false,
                        info: {
                            code: "00000",
                            script: "获取容器实例事件 " + req.params.instanceid + " 失败"
                        }
                    });
                    callback();
                }
            });
            callback(null);
        }, function (app, level, callback) { // 根据容器实例id获取容器实例基本信息

        }
    ], function (err, result) {

    });
}

/**
 * 根据容器实例id和日期（以天为单位）获取日志
 * @param req
 * @param res
 */
exports.listInstanceAllLog = function (req, res) {
    // 向底层服务接口发起获取容器实例日志请求
    //TODO

}

/**
 * 根据容器实例id获取事件列表
 * @param req
 * @param res
 */
exports.listInstanceEventById = function (req, res) {
    // 向底层服务接口发起获取容器实例事件请求
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/appevent/" + req.params.id
    }, function (containerEventResult) {
        try {
            console.log("containerEvent result ---> " + containerEventResult);
            containerEventResult = JSON.parse(containerEventResult);
            console.log("containerEvent result.result ---> " + containerEventResult.result);

            if (containerEventResult.result === true) {
                res.json(containerEventResult);
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log("获取容器实例事件失败：" + e);
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
exports.listAllDomain = function (req, res) {
    // 向底层服务接口发起获取绑定域名列表请求
    //TODO

}

/**
 * 根据容器id获取端口列表
 * @param req
 * @param res
 */
exports.listAllPort = function (req, res) {
    // 向底层服务接口获取端口列表请求
    //TODO

}

/**
 * 根据容器id和日期（以天为单位）获取日志
 * @param req
 * @param res
 */
exports.listAllLog = function (req, res) {
    // 向底层服务接口获取日志请求
    //TODO

}

/**
 * 根据服务id获取事件列表
 * @param req
 * @param res
 */
exports.listAppEventById = function (req, res) {
    // 向底层服务接口获取事件列表请求
    httpUtil.get({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/appevent/" + req.params.id
    }, function (appEventResult) {
        try {
            console.log("appEvent result ---> " + appEventResult);
            appEventResult = JSON.parse(appEventResult);
            console.log("appEvent result.result ---> " + appEventResult.result);

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
 * 启动服务后更新服务信息
 * @param req 请求对象
 * @param res 响应对象
 * @param app 服务对象
 * @param jsonResult 返回的json对象
 */
var startAfterupdateApp = function (req, res, app, jsonResult) {
    // 发起更新 app 请求
    httpUtil.put({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/app"
    }, app, function (updateAppResult) {
        try {
            console.log("update app result ---> " + updateAppResult);
            updateAppResult = JSON.parse(updateAppResult);

            if (updateAppResult.result === true) {
                res.json(jsonResult);
            } else {
                throw new Error("将服务 " + app.name + " 状态保存失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "服务 " + app.name + " 启动失败：" + e.message
                }
            });
        }
    });
}

/**
 * 根据服务id启动服务
 * @param req
 * @param res
 */
exports.start = function (req, res) {
    /****************************** 步骤开始 *********************************/
    // 1.根据服务id，获取服务信息
    // 2.根据服务id，获取容器实例列表

    /*********************** 循环开始 **************************/
    // 2.根据容器实例id启动实例
    // 3.更新容器实例状态
    // 4.记录容器实例启动成功或失败事件（异步，服务事件）
    /*********************** 循环结束 **************************/

    // 5.若服务启动成功，则映射网络
    // 6.根据容器实例启动情况，更新服务状态和时间信息
    // 7.存储服务事件（运行中事件，异步，不管成功与否）
    /****************************** 步骤结束 *********************************/

    try {
        var app = null; // 服务对象
        var containers = []; // 容器实例数组
        async.waterfall([
            function (callback) { // 根据服务id，获取服务信息
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app/" + req.params.id
                }, function (result) {
                    try {
                        console.log("get app result ---> " + result);
                        result = JSON.parse(result);

                        if (result.result !== true) {
                            throw new Error(result.info.script);
                        }
                        app = result.apps[0];
                        delete app._id;
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (callback) { // 根据服务id，获取容器实例列表
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/container/list/" + req.params.id
                }, function (result) {
                    try {
                        console.log("get containers result ---> " + result);
                        result = JSON.parse(result);

                        if (result.result !== true) {
                            throw new Error(result.info.script);
                        }
                        containers = result.containers;
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (callback) { // 循环
                var containerCounter = 0;
                var containerSuccessCounter = 0;
                var startContainerCounter = 0; // 启动容器技术器
                var startContainerFun = function (outstartcallback) {
                    var container = containers[startContainerCounter++];
                    delete container._id;
                    async.waterfall([
                        function (startcallback) { // 根据容器实例id启动实例
                            rest.postJson('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + container.id + '/start').on('complete', function (data, response) {
                                try {
                                    if (response.statusCode !== 204) {
                                        console.log("启动容器实例 " + container.id + " 失败：" + data);
                                        startcallback(null, data);
                                        return;
                                    }
                                    startcallback(null, null);
                                } catch (e) {
                                    startcallback(e);
                                }
                            });
                        }, function (err, startcallback) { // 更新容器实例状态
                            var status = 2; // 表示 运行中
                            if (err) {
                                status = 5; // 表示 启动失败
                            }
                            container.status = status;
                            httpUtil.put({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/container"
                            }, container, function (result) {
                                try {
                                    console.log("update container result ---> " + result);
                                    result = JSON.parse(result);

                                    if (result.result !== true) {
                                        throw new Error(result.info.script);
                                    }
                                    startcallback(null, err); // 触发下一步
                                } catch (e) {
                                    console.log("容器实例 " + container.id + " 更新状态失败：" + e);
                                    startcallback(e);
                                }
                            });
                        }, function (err, startcallback) { // 记录容器实例启动成功或失败事件（异步，服务事件）
                            var eventTitle = "启动成功";
                            var script = "start container " + container.id + " success";
                            if (err) {
                                eventTitle = "启动失败";
                                script = "start container " + container.id + " error";
                            }
                            var serverEventConfig = {
                                appid: app.id,
                                event: eventTitle,
                                titme: new Date().getTime(),
                                script: script
                            };
                            httpUtil.post({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/appevent"
                            }, serverEventConfig, function (eventResult) {
                                try {
                                    console.log("容器实例启动成功或失败事件" + serverEventConfig.event + serverEventConfig.script);
                                    console.log("server event result ---> " + eventResult);
                                    eventResult = JSON.parse(eventResult);

                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                                } catch (e) {
                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                                }
                            });
                            startcallback(null); // 触发下一步
                        }
                    ], function (err, result) {
                        containerCounter++;
                        if (err) {
                            console.log(err);
                            outstartcallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例启动失败");
                            return;
                        }
                        containerSuccessCounter++;
                        outstartcallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例启动成功");
                    });
                }
                var startContainerFuns = [];
                for (var i = 0; i < containers.length; i++) {
                    startContainerFuns[i] = startContainerFun;
                }
                async.parallel(
                    startContainerFuns,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("服务 " + app.name + " 有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例启动成功");
                        console.log(results);
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例启动成功个数
                    }
                );
            }, function (containerSuccessCounter, callback) { // 若服务启动成功，则映射网络
                if (containerSuccessCounter <= 0) {
                    callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                } else {
                    httpUtil.post({
                        host: dockerservice.host,
                        port: dockerservice.port,
                        path: "/v1/domain"
                    }, {subdomain: app.subdomain}, function (result) {
                        try {
                            console.log("domain result ---> " + result);
                            result = JSON.parse(result);

                            if (result.result !== true) {
                                throw new Error("映射服务 " + app.name + " 网络失败");
                            }
                            callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                        } catch (e) {
                            callback(e);
                        }
                    });
                }
            }, function (containerSuccessCounter, callback) { // 根据容器实例启动情况，更新服务状态和时间信息
                if (containerSuccessCounter <= 0) { // 表示服务启动失败，更新状态为：5.启动失败
                    app.status = 5;
                } else { // 表示服务停止成功，更新状态为：2.运行中
                    app.status = 2;
                }
                app.updatetime = new Date().getTime();
                app.address = app.subdomain + "." + dockerConfig.domain;
                httpUtil.put({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app"
                }, app, function (updateAppResult) {
                    try {
                        console.log("update app result ---> " + updateAppResult);
                        updateAppResult = JSON.parse(updateAppResult);

                        if (updateAppResult.result !== true) {
                            throw new Error("更新服务 " + app.name + " 状态失败");
                        }
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例停止成功个数
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (containerSuccessCounter, callback) { // 存储服务事件（停止事件，异步，不管成功与否）
                var serverEventConfig = {
                    appid: app.id,
                    event: "",
                    titme: new Date().getTime(),
                    script: ""
                }
                if (containerSuccessCounter <= 0) { // 表示服务启动失败，存储服务启动失败事件
                    serverEventConfig.event = "服务启动失败";
                    serverEventConfig.script = "启动服务 " + app.name + "失败";
                } else { // 表示服务启动成功，存储服务运行中事件
                    serverEventConfig.event = "运行中";
                    serverEventConfig.script = "启动服务 " + app.name + "成功，共有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例启动成功";
                }
                httpUtil.post({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/appevent"
                }, serverEventConfig, function (eventResult) {
                    try {
                        console.log("server event result ---> " + eventResult);
                        eventResult = JSON.parse(eventResult);

                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                    } catch (e) {
                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                    }
                });
                if (containerSuccessCounter <= 0) { // 服务启动失败
                    callback("没有实例启动成功");
                } else { // 表示服务启动成功，触发下一步
                    callback(null);
                }
            }
        ], function (err, result) {
            if (err) {
                console.log("根据服务 " + req.params.app + " 启动容器实例失败：" + err);
                res.json({
                    result: false,
                    info: {
                        code: "00000",
                        script: "根据服务 " + req.params.id + " 启动容器实例失败：" + err
                    }
                });
            } else {
                console.log("根据服务 " + req.params.id + " 启动容器实例成功");
                res.json({
                    result: true,
                    info: {
                        code: "10000",
                        script: "根据服务 " + req.params.id + " 启动容器实例成功"
                    },
                    address: app.address
                });
            }
        });
    } catch (e) {
        console.log("根据服务 " + req.params.id + " 启动容器实例失败：" + e);
        res.json({
            result: false,
            info: {
                code: "00000",
                script: "根据服务 " + req.params.id + " 启动容器实例失败：" + e
            }
        });
    }
}

/**
 * 停止服务后更新服务信息
 * @param req 请求对象
 * @param res 响应对象
 * @param app 服务对象
 * @param jsonResult 返回的json对象
 */
var stopAfterupdateApp = function (req, res, app, jsonResult) {
    // 发起更新 app 请求
    httpUtil.put({
        host: dockerservice.host,
        port: dockerservice.port,
        path: "/v1/app"
    }, app, function (updateAppResult) {
        try {
            console.log("update app result ---> " + updateAppResult);
            updateAppResult = JSON.parse(updateAppResult);

            if (updateAppResult.result === true) {
                res.json(jsonResult);
            } else {
                throw new Error("将服务 " + app.name + " 状态保存失败");
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "服务 " + app.name + " 停止失败：" + e.message
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
exports.stop = function (req, res) {
    /****************************** 步骤开始 *********************************/
    // 1.根据服务id，获取服务信息
    // 2.根据服务id，获取容器实例列表

    /*********************** 循环开始 **************************/
    // 2.根据容器实例id停止实例
    // 3.更新容器实例状态
    // 4.记录容器实例停止成功或失败事件（异步，服务事件）
    /*********************** 循环结束 **************************/

    // 5.若服务停止成功，则删除网络
    // 6.根据容器实例停止情况，更新服务状态和时间信息
    // 7.存储服务事件（停止事件，异步，不管成功与否）
    /****************************** 步骤结束 *********************************/

    try {
        var app = null; // 服务对象
        var containers = []; // 容器实例数组
        async.waterfall([
            function (callback) { // 根据服务id，获取服务信息
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app/" + req.params.id
                }, function (result) {
                    try {
                        console.log("get app result ---> " + result);
                        result = JSON.parse(result);

                        if (result.result !== true) {
                            throw new Error(result.info.script);
                        }
                        app = result.app;
                        delete app._id;
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (callback) { // 根据服务id，获取容器实例列表
                httpUtil.get({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/container/list/" + req.params.id
                }, function (result) {
                    try {
                        console.log("get containers result ---> " + result);
                        result = JSON.parse(result);

                        if (result.result !== true) {
                            throw new Error(result.info.script);
                        }
                        containers = result.containers;
                        callback(null); // 触发下一步
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (callback) { // 循环
                var containerCounter = 0;
                var containerSuccessCounter = 0;
                var stopContainerCounter = 0; // 停止容器技术器
                var stopContainerFun = function (outstopcallback) {
                    var container = containers[stopContainerCounter++];
                    delete container._id;
                    async.waterfall([
                        function (stopcallback) { // 根据容器实例id停止实例
                            rest.postJson('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + container.id + '/stop').on('complete', function (data, response) {
                                try {
                                    if (response.statusCode !== 204) {
                                        console.log("停止容器实例 " + container.id + " 失败：" + data);
                                        stopcallback(null, data);
                                        return;
                                    }
                                    stopcallback(null, null);
                                } catch (e) {
                                    stopcallback(e);
                                }
                            });
                        }, function (err, stopcallback) { // 更新容器实例状态
                            var status = 4; // 表示 停止成功
                            if (err) {
                                status = 6; // 表示 停止失败
                            }
                            container.status = status;
                            httpUtil.put({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/container"
                            }, container, function (result) {
                                try {
                                    console.log("update container result ---> " + result);
                                    result = JSON.parse(result);

                                    if (result.result !== true) {
                                        throw new Error(result.info.script);
                                    }
                                    stopcallback(null, err); // 触发下一步
                                } catch (e) {
                                    console.log("容器实例 " + container.id + " 更新状态失败：" + e);
                                    stopcallback(e);
                                }
                            });
                        }, function (err, stopcallback) { // 记录容器实例停止成功或失败事件（异步，服务事件）
                            var eventTitle = "停止成功";
                            var script = "stop container " + container.id + " success";
                            if (err) {
                                eventTitle = "停止失败";
                                script = "stop container " + container.id + " error";
                            }
                            var serverEventConfig = {
                                appid: app.id,
                                event: eventTitle,
                                titme: new Date().getTime(),
                                script: script
                            }
                            httpUtil.post({
                                host: dockerservice.host,
                                port: dockerservice.port,
                                path: "/v1/appevent"
                            }, serverEventConfig, function (eventResult) {
                                try {
                                    console.log("server event result ---> " + eventResult);
                                    eventResult = JSON.parse(eventResult);

                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                                } catch (e) {
                                    console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                                }
                            });
                            stopcallback(null); // 触发下一步
                        }
                    ], function (err, result) {
                        containerCounter++;
                        if (err) {
                            console.log(err);
                            outstopcallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例停止失败");
                            return;
                        }
                        containerSuccessCounter++;
                        outstopcallback(null, "服务 " + app.name + "第 [" + containerCounter + "/" + app.instance + "] 个实例停止成功");
                    });
                }
                var stopContainerFuns = [];
                for (var i = 0; i < containers.length; i++) {
                    stopContainerFuns[i] = stopContainerFun;
                }
                async.parallel(
                    stopContainerFuns,
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("服务 " + app.name + " 有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例停止成功");
                        console.log(results);
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                    }
                );
            }, function (containerSuccessCounter, callback) { // 若服务停止成功，则删除网络
                if (containerSuccessCounter <= 0) {
                    callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                } else {
                    httpUtil.delete({
                        host: dockerservice.host,
                        port: dockerservice.port,
                        path: "/v1/domain/" + app.subdomain
                    }, function (result) {
                        try {
                            console.log("delete domain result ---> " + result);
                            result = JSON.parse(result);

                            if (result.result !== true) {
                                throw new Error("删除服务 " + app.name + " 网络失败");
                            }
                            callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                        } catch (e) {
                            callback(e);
                        }
                    });
                }
            }, function (containerSuccessCounter, callback) { // 根据容器实例停止情况，更新服务状态和时间信息
                if (containerSuccessCounter <= 0) { // 表示服务停止失败，更新状态为：6.停止失败
                    app.status = 6;
                } else { // 表示服务停止成功，更新状态为：4.已停止
                    app.status = 4;
                }
                app.updatetime = new Date().getTime();
                app.address = "-";
                httpUtil.put({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/app"
                }, app, function (updateAppResult) {
                    try {
                        console.log("update app result ---> " + updateAppResult);
                        updateAppResult = JSON.parse(updateAppResult);

                        if (updateAppResult.result !== true) {
                            throw new Error("更新服务 " + app.name + " 状态失败");
                        }
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例停止成功个数
                    } catch (e) {
                        callback(e);
                    }
                });
            }, function (containerSuccessCounter, callback) { // 存储服务事件（停止事件，异步，不管成功与否）
                var serverEventConfig = {
                    appid: app.id,
                    event: "",
                    titme: new Date().getTime(),
                    script: ""
                }
                if (containerSuccessCounter <= 0) { // 表示服务停止失败，存储服务停止失败事件
                    serverEventConfig.event = "服务停止失败";
                    serverEventConfig.script = "停止服务 " + app.name + "失败";
                } else { // 表示服务停止成功，存储服务已停止事件
                    serverEventConfig.event = "已停止";
                    serverEventConfig.script = "停止服务 " + app.name + "成功，共有 [" + containerSuccessCounter + "/" + app.instance + "] 个实例停止成功";
                }
                httpUtil.post({
                    host: dockerservice.host,
                    port: dockerservice.port,
                    path: "/v1/appevent"
                }, serverEventConfig, function (eventResult) {
                    try {
                        console.log("server event result ---> " + eventResult);
                        eventResult = JSON.parse(eventResult);

                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件情况：" + eventResult.info.script);
                    } catch (e) {
                        console.log("服务 " + app.name + " 保存" + serverEventConfig.event + "事件失败：" + e);
                    }
                });
                if (containerSuccessCounter <= 0) { // 服务停止失败
                    callback("没有实例停止成功");
                } else { // 表示服务停止成功，触发下一步
                    callback(null);
                }
            }
        ], function (err, result) {
            if (err) {
                console.log("根据服务 " + req.params.app + " 停止容器实例失败：" + err);
                res.json({
                    result: false,
                    info: {
                        code: "00000",
                        script: "根据服务 " + req.params.id + " 停止容器实例失败：" + err
                    }
                });
            } else {
                console.log("根据服务 " + req.params.id + " 停止容器实例成功");
                res.json({
                    result: true,
                    info: {
                        code: "10000",
                        script: "根据服务 " + req.params.id + " 停止容器实例成功"
                    }
                });
            }
        });
    } catch (e) {
        console.log("根据服务 " + req.params.id + " 停止容器实例失败：" + e);
        res.json({
            result: false,
            info: {
                code: "00000",
                script: "根据服务 " + req.params.id + " 停止容器实例失败：" + e
            }
        });
    }
}

/**
 * 根据容器实例 id 获取日志
 * @param req
 * @param res
 */
exports.getInstanceLog = function (req, res) {
    console.log("instanceid ---> " + req.params.instanceid);
    /*httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/containers/"+req.params.instanceid+"/logs"}, function(result){
     console.log(result);
     res.json({
     result: true,
     info: {
     code: "10000",
     script: "获取日志成功"
     },
     data : result.toString()
     });
     });*/
    var logData = [];
    var headers = {
        'Content-Type': 'application/plain; charset=UTF-8'
    };
    var options = {
        host: dockerConfig.host,
        port: dockerConfig.port,
        path: '/containers/' + req.params.instanceid + '/logs?stderr=1&stdout=1',
        method: 'GET',
        headers: headers
    }
    console.log('获取日志开始');
    var reqGet = http.request(options, function (resGet) {
        resGet.on("data", function (data) {
            logData.push(data.toString());
        });
        resGet.on("end", function () {
            console.log("logData ---> " + logData);
            res.json({
                result: true,
                info: {
                    code: "10000",
                    script: "获取日志成功"
                },
                data: logData
            });
        });
    });
    reqGet.end();
    console.log('获取日志结束');
    reqGet.on('error', function (e) {
        console.error(e);
    });
}


