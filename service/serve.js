/**
 * 服务业务
 * Created by lingyuwang on 2016/4/26.
 */

var userDao = require('../dao/user');
var networkDao = require('../dao/network');
var containerDao = require('../dao/container');
var imageDao = require('../dao/image');
var serveDao = require('../dao/serve');
var containerService = require('../service/container');
var async = require('async');
var moment = require('moment');
var logger = require("../modules/log/log").logger();

/**
 * 创建服务
 * 1.根据 token 获取用户id
 * 2.根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
 * 3.根据网络名称生成网络，然后记录网络 id
 * 4.保存服务配置信息
 * 5.存储服务事件（异步，不管成功与否）
 * @param token
 * @param serveConfig 服务配置
 * @param res
 */
exports.create = function (token, serveConfig, callback) {
    // 多个函数依次执行，且前一个的输出为后一个的输入
    async.waterfall([
        function (waterfallCallback) {
            var status = serveConfig.status;
            if (status == 7) {
                logger.info("服务创建失败");
                waterfallCallback("服务创建失败");
            } else {
                waterfallCallback(null);//触发下一步
            }
        },
        function (waterfallCallback) {// 根据 token 获取用户id
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   根据token  ' + token + '  获取用户id');
                        serveConfig.owner = result.id;
                        waterfallCallback(null);//触发下一步
                    } else {
                        logger.info("根据token " + token + " 获取用户id失败：" + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.info("根据token " + token + " 获取用户id失败：" + e);
                    waterfallCallback("根据token获取用户id失败");
                }
            });
        }, function (waterfallCallback) {// 根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
            userDao.get(serveConfig.owner, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   获取用户基本信息成功');
                        //todo result.people.profile.sub_domain
                        var networkAndSubdomain = result.people.profile.sub_domain + "." + serveConfig.name + ".app";
                        serveConfig.network = networkAndSubdomain;
                        serveConfig.subdomain = networkAndSubdomain;
                        waterfallCallback(null);//触发下一步
                    } else {
                        logger.info("根据id " + serveConfig.owner + " 获取用户基本信息失败err：" + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.info("根据id " + serveConfig.owner + " 获取用户基本信息失败e：" + e);
                    waterfallCallback("据id获取用户信息失败");
                }
            });
        }, function (waterfallCallback) {// 根据网络名称生成网络，然后记录网络 id
            var postdata = {
                "Name": serveConfig.network, // 网络名
                "Driver": "overlay",
                "EnableIPv6": false,
                "Internal": false
            };
            networkDao.creat(postdata, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   创建网络' + serveConfig.network + '成功');
                        serveConfig.networkid = result.Id;
                        waterfallCallback(null);//触发下一步
                    } else {
                        logger.info('创建网络失败：' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.info('创建网络失败：' + e);
                    waterfallCallback('创建网络失败');
                }
            });
        }, function (waterfallCallback) { // 保存服务配置信息
            serveDao.save(serveConfig, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   保存服务配置信息');
                        waterfallCallback(null);//触发下一步
                    } else {
                        logger.info('保存服务配置失败:' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.info('保存服务配置失败:' + e);
                    waterfallCallback('保存服务配置失败');
                }
            });
        }, function (waterfallCallback) {// 存储服务事件
            var containerEventConfig = {
                appid: serveConfig.id,
                event: "创建成功",
                titme: new Date().getTime(),
                script: "create app ：" + serveConfig.id,
                status: 1//1:success;2:failed
            }
            serveDao.saveEvent(containerEventConfig, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   存储服务事件');
                        waterfallCallback(null);//触发下一步
                    } else {
                        containerEventConfig.status = 2;
                        logger.info('存储服务事件失败:' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    containerEventConfig.status = 2;
                    logger.info('存储服务事件失败:' + e);
                    waterfallCallback('存储服务事件失败');
                }
            });
        }
    ], function (error) {
        if (error) {
            serveConfig.status = 7;
            logger.info("创建服务失败：" + error);
            return callback("创建服务失败：" + error);
        } else {
            logger.debug("创建服务成功");
            return callback(null, serveConfig);
        }
    });
}

/**
 * 根据服务id更新实例个数和实例类型
 * @param resourceParams
 * @param callback
 */
exports.update = function (resourceParams, callback) {
    // 根据服务id获取服务信息
    // 检查实例类型是否有变
    // 若有变，则删掉之前的实例，更新配置（根据服务id，启动新的实例）
    // 若不变，则直接更新配置（根据服务配置，启动新实例——添加实例）
    try {
        async.waterfall([
            function (waterfallCallback) {//保存资源调整事件
                var containerEventConfig = {
                    appid: resourceParams.id,
                    event: "资源调整",
                    titme: new Date().getTime(),
                    script: "update app resource：" + resourceParams.id,
                }
                serveDao.saveEvent(containerEventConfig, function (err, result) {
                    try {
                        if (!err) {
                            logger.debug(moment().format('h:mm:ss') + '   存储服务事件');
                            waterfallCallback(null);//触发下一步
                        } else {
                            logger.info('存储服务事件失败:' + err);
                            waterfallCallback(err);
                        }
                    } catch (e) {
                        logger.info('存储服务事件失败:' + e);
                        waterfallCallback('存储服务事件失败');
                    }
                });
            },
            function (waterfallCallback) { // 根据服务id获取服务信息
                serveDao.get(resourceParams.id, function (err, data) {
                    try {
                        if (!err) {
                            logger.debug('根据服务id获取服务信息');
                            var app = data.app;
                            delete app._id; // 删除 _id 属性
                            waterfallCallback(null, app);
                        } else {
                            logger.info('根据服务id:' + resourceParams.appid + '获取服务信息失败' + err);
                            waterfallCallback(err);
                        }
                    } catch (e) {
                        logger.info('根据服务id:' + resourceParams.appid + '获取服务信息失败' + e);
                        waterfallCallback(e);
                    }
                })
            }, function (app, waterfallCallback) { //更新服务配置
                resourceParams.owner = app.owner;
                resourceParams.name = app.name;
                resourceParams.image = app.image;
                resourceParams.imagetag = app.imagetag;
                resourceParams.command = app.command;
                resourceParams.env = app.env;
                resourceParams.network = app.network;
                resourceParams.networkid = app.networkid;
                resourceParams.subdomain = app.subdomain;
                resourceParams.status = app.status;
                resourceParams.createtime = app.createtime;
                resourceParams.address = app.address;
                serveDao.update(resourceParams, function (err) {
                    try {
                        if (!err) {
                            logger.debug(moment().format('h:mm:ss') + '   更新服务配置信息');
                            waterfallCallback(null, app);//触发下一步
                        } else {
                            logger.info('更新服务配置失败:' + err);
                            waterfallCallback(err);
                        }
                    } catch (e) {
                        logger.info('更新服务配置失败:' + e);
                        waterfallCallback('更新服务配置失败' + e);
                    }
                });
            }, function (app, waterfallCallback) {// 检查实例类型是否有变
                var levelChange = false;
                if (resourceParams.conflevel !== app.conflevel) { // 若有变，则删掉之前的实例，更新配置（根据服务id，启动新的实例）
                    levelChange = true;
                    async.waterfall([
                        function (delCallback) {//获取容器列表
                            containerDao.listByAppid(resourceParams.id, function (err, result) {
                                try {
                                    if (!err) {
                                        logger.debug('获取容器列表成功');
                                        var containers = result.containers;
                                        delCallback(null, containers);
                                    } else {
                                        logger.info('获取容器列表失败err' + err);
                                        delCallback('获取容器列表失败err' + err);
                                    }
                                } catch (e) {
                                    logger.info('获取容器列表失败e' + e);
                                    delCallback('获取容器列表失败e' + e);
                                }
                            });
                        }, function (containers, delCallback) {//删除容器
                            var containeridList = [];
                            for (var i = 0; i < containers.length; i++) {
                                containeridList[i] = containers[i].id;
                            }
                            containerService.removeByList(containeridList, function (err) {
                                try {
                                    if (!err) {
                                        delCallback(null);
                                    } else {
                                        delCallback(err);
                                    }
                                } catch (e) {
                                    delCallback(e);
                                }
                            });
                        }], function (err) {
                        if (err) {
                            logger.info('更新配置---删除容器失败' + err);
                            waterfallCallback('更新配置---删除容器失败' + err);
                        } else {
                            waterfallCallback(null, levelChange);
                        }
                    });
                } else { // 若不变，则直接更新配置（根据服务配置，启动新实例——添加实例）
                    var instance = resourceParams.instance - app.instance;
                    waterfallCallback(null, levelChange, instance);
                }
            }
        ], function (error, levelChange, instance) {
            if (!error) {
                return callback(null, levelChange, instance);
            } else {
                return callback(error);
            }
        });
    } catch (e) {
        logger.info(e);
        return callback(e);
    }
}

/**
 * 删除服务
 * 1.获取容器列表
 * 2.根据列表删除容器
 * 3.删除容器相关网络
 * 4.删除数据库
 * @param serveid
 * @param callback
 */
exports.remove = function (appId, callback) {
    var containers;
    async.waterfall([
        function (waterfullCallback) {//获取容器列表
            containerDao.listByAppid(appId, function (err, result) {
                try {
                    if (!err) {
                        logger.debug('获取容器列表成功');
                        containers = result.containers;
                        waterfullCallback(null, containers);
                    } else {
                        logger.info('根据APPID' + appId + '获取容器列表失败err' + err);
                        waterfullCallback('根据APPID' + appId + '获取容器列表失败err' + err);
                    }
                } catch (e) {
                    logger.info('根据APPID' + appId + '获取容器列表失败e' + e);
                    waterfullCallback('根据APPID' + appId + '获取容器列表失败e' + e);
                }
            });
        }, function (containers, waterfullCallback) {//删除容器
            var containeridList = [];
            for (var i = 0; i < containers.length; i++) {
                containeridList[i] = containers[i].id;
            }
            containerService.removeByList(containeridList, function (err, result) {
                try {
                    if (!err) {
                        waterfullCallback(null);
                    } else {
                        waterfullCallback(err);
                    }
                } catch (e) {
                    waterfullCallback(e);
                }
            });
        }, function (waterfullCallback) {//删除容器相关网络
            //获取网络ID
            serveDao.get(appId, function (err, result) {
                try {
                    if (!err) {
                        logger.debug('获取网络id');
                        var app = result.app;
                        var networkid = result.app.networkid;
                        // 删除网络
                        networkDao.remove(networkid, function (error, data) {
                            try {
                                if (!error) {
                                    logger.debug("删除网络成功");
                                    waterfullCallback(null, app);
                                } else {
                                    logger.info("删除网络失败err" + error);
                                    waterfullCallback("删除网络失败" + error);
                                }
                            } catch (e) {
                                logger.info("删除网络失败e" + e);
                                waterfullCallback("删除网络失败" + e);
                            }
                        });
                    } else {
                        logger.info("获取网络id失败" + err);
                        waterfullCallback("获取网络id失败" + err);
                    }
                } catch (e) {
                    logger.info(e);
                    waterfullCallback(e);
                }
            });
        }, function (app, waterfullCallback) {//数据库APP删除
            serveDao.delete(app.id, function (err) {
                try {
                    if (!err) {
                        logger.debug('数据库APP删除成功');
                        waterfullCallback(null);
                    } else {
                        logger.info('数据库APP删除失败err' + err);
                        waterfullCallback('数据库APP删除失败err' + err);
                    }
                } catch (e) {
                    logger.info('数据库APP删除失败e' + e);
                    waterfullCallback('数据库APP删除失败e' + e);
                }
            });
        }
    ], function (err) {
        if (err) {//出现错误，数据库APP标记为已删除
            logger.info('出现错误，数据库APP标记为已删除');
            serveDao.delete(appId, function (err) {
                try {
                    if (!err) {
                        logger.debug('数据库APP删除成功');
                    } else {
                        logger.info('数据库APP删除失败err' + err);
                    }
                } catch (e) {
                    logger.info('数据库APP删除失败e' + e);
                    return callback(e);
                }
                return callback(err);
            });
            /*         serveDao.get(appId, function (err, result) {
             var app = result.app;
             if (!err) {
             var server = {
             "id": app.id,
             "owner": app.owner,
             "name": app.name,
             "image": app.image,
             "imagetag": app.imagetag,
             "conflevel": app.conflevel,
             "instance": app.instance,
             "expandPattern": app.expandPattern,
             "command": app.command,
             "network": app.network,
             "networkid": app.networkid,
             "subdomain": app.subdomain,
             "status": app.status,
             "createtime": app.createtime,
             "updatetime": new Date().getTime(),
             "deleteFlag": 1
             };
             serveDao.update(server, function (err, result) {
             try {
             if (!err) {
             logger.debug("数据库APP标记为已删除成功");
             } else {
             logger.error("数据库APP标记为已删除失败" + err);
             }
             } catch (e) {
             logger.error("数据库APP标记为已删除失败" + e);
             }
             });
             }
             return callback(err);
             });*/
        } else {
            return callback(null);
        }
    });

}


exports.removeDomainByAppid = function (appid, callback) {

    async.waterfall([
        function (waterfallCallback) {//根据APPID获取域名
            serveDao.get(appid, function (err, result) {
                try {
                    if (!err) {
                        logger.debug('根据APPID ' + appid + '获取域名:' + result.app.subdomain);
                        waterfallCallback(null, result.app.subdomain);
                    } else {
                        logger.debug('根据APPID ' + appid + '获取域名err' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.debug('根据APPID ' + appid + '获取域名e', e);
                    waterfallCallback(e);
                }
            });
        },
        function (subdomain, waterfallCallback) {//删除域名
            serveDao.distoryDomain(subdomain, function (err, result) {
                try {
                    if (!err) {
                        logger.debug('删除域名' + subdomain + '成功');
                        waterfallCallback(null);
                    } else {
                        logger.debug('删除域名' + subdomain + '失败 err', err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.debug('删除域名' + subdomain + '失败 e', e);
                    waterfallCallback(e);
                }
            })
        }
    ], function (err) {
        return callback(err);
    })
}














