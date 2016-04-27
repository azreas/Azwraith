/**
 * 容器 业务
 * Created by lingyuwang on 2016/4/26.
 */


var containerDao = require('../dao/container');
var serveDao = require('../dao/serve');
var async = require("async");


/**
 * 根据服务 id 获取服务配置信息，并创建容器实例
 * @param appid
 * @param callback
 */
exports.create = function (appid, servicecallback) {
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
            function(callback){ // 根据服务 id 获取服务信息
                serveDao.get(appid, function (err, data) {
                    try {
                        if (err) {
                            throw new Error(err);
                        }

                        console.log("app result ---> "+JSON.stringify(data));

                        app = appResult.apps[0];
                        delete app._id; // 删除 _id 属性
                    } catch (e) {
                        return callback(e); // 直接跳到返回结果函数，进行异常处理
                    }
                    callback(null); // 触发下一步
                });
            },function (callback) { // 根据配置级别 conflevel 获取配置
                serveDao.getSetmealByConflevel(app.conflevel, function (err, data) {
                    try {
                        if (err) {
                            throw new Error(err);
                        }

                        console.log("level result ---> "+JSON.stringify(data));

                        level.memory = levelResult.setneal.memory*1024*1024;
                        level.cpu = levelResult.setneal.cpu;
                    } catch (e) {
                        return callback(e); // 直接跳到返回结果函数，进行异常处理
                    }
                    callback(null); // 触发下一步
                });
            },function (callback) { // 检查镜像是否已存在，若不存在，则先 pull 一个
                console.log("检查镜像是否已存在，若不存在，则先 pull 一个 ...");
                callback(null); // 触发下一步
            },function (callback) { // 循环创建容器实例
                var containerCounter = 0; // 创建容器实例计数器
                var containerSuccessCounter = 0; // 创建容器实例成功计数器
                // 创建容器方法
                var createContainerFun = function (outcreatecallback) {
                    var containerOpts = {
                        Image: app.image+":"+app.imagetag,
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
                        function(createcallback){ // 创建容器实例
                            containerDao.create(containerOpts, function (err, data) {
                                try {
                                    if (err) {
                                        throw new Error(err);
                                    }

                                    console.log("容器实例 "+data.Id+" 创建成功");
                                } catch (e) {
                                    return createcallback(e);
                                }
                                createcallback(null, data.Id); // 触发下一步，并传容器实例id
                            });
                        },function(containerid, createcallback){ // 存储容器实例创建成功事件（不管事件保存成功与否都进行下一步）
                            var containerEventConfig = {
                                containerid : containerid,
                                title : "创建成功",
                                titme : new Date().getTime(),
                                script : "create container:"+containerid
                            };
                            containerDao.saveEvent(containerEventConfig, function (err, data) {
                                try {
                                    if (err) {
                                        throw new Error(err);
                                    }

                                    console.log("create containerEvent result ---> "+JSON.stringify(data));
                                    console.log("容器实例 "+containerEventConfig.containerid+" 保存创建事件情况："+data.info.script);
                                } catch (e) {
                                    console.log("容器实例 "+containerEventConfig.containerid+" 保存创建事件失败："+e);
                                }
                            });
                            createcallback(null, containerid); // 触发下一步，不管事件保存成功与否
                        },function(containerid, createcallback){ // 启动实例
                            containerDao.start(containerid, function (err, data) {
                                try {
                                    if (err) {
                                        throw new Error(err);
                                    }
                                } catch (e) {
                                    console.log("启动容器实例 "+containerid+" 失败："+e);
                                    createcallback(e);
                                }
                                createcallback(null, containerid, null);
                            });
                        },function(containerid, err, createcallback){ // 存储容器实例启动成功或失败事件，若失败，则直接结束“这条线”
                            var eventTitle = "";
                            var script;
                            var time = new Date().getTime();
                            var containerEventConfig = {
                                containerid : containerid,
                                title : "",
                                titme : time,
                                script : ""
                            };
                            if (!err) {
                                eventTitle = "启动成功";
                                script="start container "+containerid+" success";
                                containerEventConfig.title=eventTitle;
                                containerEventConfig.script=script;
                                containerDao.saveEvent(containerEventConfig, function (err, data) {
                                    try {
                                        console.log("start containerEvent result ---> "+JSON.stringify(data));

                                        console.log("容器实例 "+containerEventConfig.containerid+" 保存"+eventTitle+"事件情况："+data.info.script);
                                    } catch (e) {
                                        console.log("容器实例 "+containerEventConfig.containerid+" 保存"+eventTitle+"事件失败："+e);
                                    }
                                });
                            } else {
                                eventTitle = "启动失败";
                                script="start container "+containerid+" error";
                            }
                            var serverEventConfig = {
                                appid : app.id,
                                event : eventTitle,
                                titme : time,
                                script : script
                            };
                            serveDao.saveEvent(serverEventConfig, function (err, data) {
                                try {
                                    console.log("server event result ---> "+JSON.stringify(data));

                                    console.log("服务 "+app.name+" 保存"+serverEventConfig.event+"事件情况："+data.info.script);
                                } catch (e) {
                                    console.log("服务 "+app.name+" 保存"+serverEventConfig.event+"事件失败："+e);
                                }
                            });
                            if (err) { // 若启动失败，则直接结束“这条线”
                                return createcallback(err);
                            }
                            createcallback(null, containerid); // 触发下一步，并传容器实例id
                        },function (containerid, createcallback) { // 获取实例信息
                            containerDao.inspect(containerid, function (err, data) {
                                try {
                                    if (err) {
                                        throw new Error(err);
                                    }

                                    var instanceProtocol; // 实例协议
                                    var instancePort; // 实例端口
                                    var serverHost; // 服务ip
                                    var serverPort; // 服务端口
                                    var ports = data.NetworkSettings.Ports;
                                    for(var p in ports){
                                        serverPort = ports[p][0].HostPort;
                                        instancePort = p.split("/")[0];
                                        instanceProtocol = p.split("/")[1];
                                        break;
                                    }
                                    serverHost = data.Node.IP;
                                    console.log("serverAddress ---> "+serverHost+":"+serverPort);
                                    var networkName=app.network;

                                    var instanceHost = data.NetworkSettings.Networks[networkName].IPAddress; // 实例ip
                                    console.log("instanceAddress ---> "+instanceHost+":"+instancePort);

                                    console.log("instanceProtocol ---> "+instanceProtocol);

                                    var containerConfig = {
                                        id : containerid,
                                        appid : app.id,
                                        outaddress : {
                                            schema : instanceProtocol,
                                            ip : serverHost,
                                            port : serverPort
                                        },
                                        inaddress : {
                                            schema : instanceProtocol,
                                            ip : instanceHost,
                                            port : instancePort
                                        },
                                        name : app.name+"-"+stringUtil.randomString(5),
                                        status : 2,// // 容器实例状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                                        createtime : new Date(data.Created).getTime(),
                                    };
                                } catch (e) {
                                    return createcallback(e);
                                }
                                createcallback(null, containerConfig); // 触发下一步，并传容器配置对象
                            });
                        },function (containerConfig, createcallback) { // 存储容器配置对象
                            containerDao.save(containerConfig, function (err, data) {
                                try {
                                    if (err) {
                                        throw new Error(err);
                                    }

                                    console.log("save container result ---> "+JSON.stringify(data));
                                } catch (e) {
                                    console.log("容器实例 "+containerConfig.id+" 保存配置失败："+e);
                                    return createcallback(e);
                                }
                                createcallback(null); // 触发下一步
                            });
                        }
                    ],function(err, result) {
                        containerCounter ++;
                        if (err) {
                            console.log(err);
                            outcreatecallback(null, "服务 "+app.name+ "第 ["+containerCounter+"/"+app.instance+"] 个实例创建失败");
                            return;
                        }
                        containerSuccessCounter ++;
                        outcreatecallback(null, "服务 "+app.name+ "第 ["+containerCounter+"/"+app.instance+"] 个实例创建成功");
                    });
                };

                var createContainerArray = [];
                // 根据实例个数，得到创建实例数组
                for (var i=0; i<app.instance; i++) {
                    createContainerArray[i] = createContainerFun;
                }

                async.parallel(
                    createContainerArray,
                    function(err, results){
                        if (err) {
                            console.log(err);
                        }
                        console.log("服务 "+app.name+ " 有 ["+containerSuccessCounter+"/"+app.instance+"] 个实例创建成功");
                        console.log(results);
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                    }
                );
            },function(containerSuccessCounter, callback){ // 若有实例启动成功，则映射子域名
                if (containerSuccessCounter<=0) {
                    callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                } else {
                    serveDao.createDomain({subdomain:app.subdomain}, function (err, data) {
                        try {
                            if (err) {
                                throw new Error(err);
                            }

                            console.log("domain result ---> "+JSON.stringify(data));
                        } catch (e) {
                            return callback(e);
                        }
                        callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                    });
                }
            },function (containerSuccessCounter, callback) { // 根据容器实例创建情况，更新服务配置信息
                console.log("根据容器实例创建情况，更新服务配置信息 ...");
                if (containerSuccessCounter<=0) { // 表示服务启动失败，更新状态为：5.启动失败
                    app.status = 5;
                } else { // 表示服务启动成功，更新状态为：2.运行中
                    app.status = 2;
                }
                app.updatetime = new Date().getTime();
                app.address = app.subdomain+"."+dockerConfig.domain;
                serveDao.save(app, function (err, data) {
                    try {
                        if (err) {
                            throw new Error(err);
                        }

                        console.log("update app result ---> "+JSON.stringify(data));
                    } catch (e) {
                        return callback(e);
                    }
                    callback(null, containerSuccessCounter); // 触发下一步，并传容器实例创建成功个数
                });
            },function (containerSuccessCounter, callback) { // 存储服务事件（运行事件，异步，不管成功与否）
                var serverEventConfig = {
                    appid : app.id,
                    event : "",
                    titme : new Date().getTime(),
                    script:""
                }
                if (containerSuccessCounter<=0) { // 表示服务启动失败，存储服务启动失败事件
                    serverEventConfig.event = "服务启动失败";
                    serverEventConfig.script = "启动服务 "+app.name+ "失败";
                } else { // 表示服务启动成功，存储服务运行中事件
                    serverEventConfig.event = "运行中";
                    serverEventConfig.script = "启动服务 "+app.name+ "成功，共有 ["+containerSuccessCounter+"/"+app.instance+"] 个实例启动成功";
                }
                serveDao.saveEvent(serverEventConfig, function (err, data) {
                    try {
                        if (err) {
                            throw new Error(err);
                        }

                        console.log("server event result ---> "+JSON.stringify(data));
                        console.log("服务 "+app.name+" 保存"+serverEventConfig.event+"事件情况："+data.info.script);
                    } catch (e) {
                        console.log("服务 "+app.name+" 保存"+serverEventConfig.event+"事件失败："+e);
                    }
                });

                if (containerSuccessCounter<=0) { // 服务启动失败
                    callback("没有实例启动成功");
                } else { // 表示服务启动成功，触发下一步
                    callback(null);
                }
            }
        ],function(err, result) {
            servicecallback(err, result);
        });
    } catch (e) {
        servicecallback(e);
    }
};







































