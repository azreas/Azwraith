/**
 * 服务控制层
 * Created by xzj on 2016/4/27 0027.
 */

var serveService = require('../service/serve');
var containerService = require('../service/container');
var containerDao = require('../dao/container');
var async = require('async');
var uuid = require('node-uuid');
var logger = require("../modules/log/log").logger();

/**
 * 服务创建
 * 1.创建并保存服务配置
 * 2.根据服务 id 获取服务配置信息，并创建容器实例
 * @param req
 * @param res
 * @param next
 */
exports.create = function (req, res, next) {
    try {
        var envName = req.body.envName;
        var envValue = req.body.envVal;
        var env = [];
        var envCount = 0;
        if ((typeof envName == 'object') && envName.constructor == Array) {
            for (var i = 0; i < envName.length; i++) {
                if (envName[i] != '' && envValue[i] != '') {
                    env[envCount++] = envName[i] + "=" + envValue[i];
                }
            }
        } else if (envName.length > 0) {
            if (envName != '' && envValue != '') {
                env[0] = envName + "=" + envValue
            }
        }

        var serveConfig = {
            id: uuid.v4(), // 服务 id
            owner: "", // 用户 id，通过 token 获取
            name: req.body.name, // 服务名称
            image: req.body.image, // 镜像名称
            imagetag: req.body.imagetag ? req.body.imagetag : "latest", // 镜像版本
            conflevel: req.body.conflevel, // 配置级别
            instance: parseInt(req.body.instance, 10), // 实例个数
            expandPattern: 1, // 拓展方式，1表示自动，2表示手动
            command: req.body.command, // 执行命令
            env: env,//环境变量
            network: "", // 网络名（email-name+appname）
            networkid: "", // 网络 id
            subdomain: "", // 子域名（email-name+appname）
            status: 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
            createtime: new Date().getTime(), // 创建时间
            updatetime: new Date().getTime(), // 更新时间
            address: "-" // 服务地址
        };
        serveService.create(req.cookies.token, serveConfig, function (err, result) {
            try {
                if (!err) {// 保存服务配置成功，则发异步请求创建实例
                    serveConfig = result;
                    containerService.create(serveConfig.id, null, function (error, data) {
                        if (!error) {
                            logger.debug(data);
                        } else {
                            logger.info(error);
                        }
                    });
                    res.redirect("/detail/" + serveConfig.id); // 重定向到服务详情页
                } else {
                    next(err);
                }
            } catch (e) {
                next(e);
            }
        });
    } catch (e) {
        next(e);
    }
}

/**
 * 服务删除
 * @param req
 * @param res
 * @param next
 */
exports.remove = function (req, res, next) {
    try {
        var ids = req.params.id.split(',');
        var errorCount = 0;
        for (var i in ids) {
            console.log(ids[i]);
            var id = ids[i];
            serveService.remove(id, function (err, result) {
                try {
                    if (!err) {

                    } else {
                        errorCount++;
                    }
                } catch (e) {
                    next(e);
                }
            });
        }
        if (errorCount !== 0) {
            res.json({result: false});
        } else {
            res.json({result: true});
        }
    } catch (e) {
        next(e);
    }
}

/**
 * 服务变更（资源控制）
 * @param req
 * @param res
 * @param next
 */
exports.update = function (req, res, next) {
    try {
        var resourceParams = {
            id: req.body.appid, // 服务 id
            owner: "", // 用户 id，通过 token 获取
            name: "", // 服务名称
            image: "", // 镜像名称
            imagetag: "", // 镜像版本
            conflevel: req.body.conflevel, // 配置级别
            instance: parseInt(req.body.instance, 10), // 实例个数
            expandPattern: 1, // 拓展方式，1表示自动，2表示手动
            command: "", // 执行命令
            env: "",//环境变量
            network: "", // 网络名（email-name+appname）
            networkid: "", // 网络 id
            subdomain: "", // 子域名（email-name+appname）
            status: 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
            createtime: "", // 创建时间
            updatetime: new Date().getTime(), // 更新时间
            address: "" // 服务地址
        };
        serveService.update(resourceParams, function (err, levelChange, instance) {
            try {
                if (!err) {
                    if (levelChange) {//配置级别变更，重新创建所有容器
                        containerService.create(resourceParams.id, null, function (error, data) {
                            try {
                                if (!error) {
                                    logger.debug(data);
                                    res.json({result: true});
                                } else {
                                    logger.info(error);
                                    res.json({result: false});
                                }
                            } catch (e) {
                                logger.info(e);
                                res.json({result: false});
                            }
                        });
                    } else {//配置级别不变，调整实例个数
                        if (instance > 0) {//实例增加
                            containerService.create(resourceParams.id, instance, function (error, data) {
                                try {
                                    if (!error) {
                                        logger.debug(data);
                                        res.json({result: true});
                                    } else {
                                        logger.info(error);
                                        res.json({result: false});
                                    }
                                } catch (e) {
                                    logger.info(e);
                                    res.json({result: false});
                                }
                            });
                        } else if (instance < 0) {//实例减少
                            containerService.removeByAppid(resourceParams.id, Math.abs(instance), function (error, data) {
                                try {
                                    if (!error) {
                                        logger.debug(data);
                                        res.json({result: true});
                                    } else {
                                        logger.info(error);
                                        res.json({result: false});
                                    }
                                } catch (e) {
                                    logger.info(e);
                                    res.json({result: false});
                                }
                            });
                        }
                    }
                } else {
                    logger.info(err);
                    next(err);
                }
            } catch (e) {
                logger.info(e);
            }
        });
    } catch (e) {
        logger.info(e);
    }
}