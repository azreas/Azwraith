/**
 * Created by xzj on 2016/6/28 0028.
 */
'use strict';
let composeParser = require('../modules/parser');
let docker = require('../dao/docker');
let async = require('async');
let _ = require('lodash');
let userDao = require('../dao/user');
let composeDao = require('../dao/composer');
let uuid = require('node-uuid');
let logger = require("../modules/log/log").logger();
var serveService = require('../service/serve');
var containerService = require('../service/container');
let moment = require('moment');
var stringUtil = require('../modules/util/stringUtil');


/**
 * 生成服务配置
 * @param serverName
 * @param createParameter
 * @param cb
 */
function generateServeConfig(serverName, userComposeName, createParameter, cb) {
    let serveConfig = {
        id: uuid.v4(), // 服务 id
        owner: "", // 用户 id，通过 token 获取
        name: userComposeName, // 服务名称
        image: '', // 镜像名称
        imagetag: 'latest', // 镜像版本
        conflevel: '', // 配置级别
        instance: 1, // 实例个数
        autoscale: false, // 拓展方式，true表示自动，false表示手动
        command: '', // 执行命令
        env: createParameter.Env || [],//环境变量
        network: "", // 网络名（email-name+appname）
        networkid: "", // 网络 id
        subdomain: "", // 子域名（email-name+appname）
        status: 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败,7.创建失败
        createtime: new Date().getTime(), // 创建时间
        updatetime: new Date().getTime(), // 更新时间
        address: "-", // 服务地址
        aliasesName: serverName

    };
    //判断镜像名是否带tag
    let imageName = createParameter.Image.split(':');
    serveConfig.image = imageName[0];
    if (imageName.length > 1) {
        serveConfig.imagetag = imageName[1];
    }
    logger.debug('serveConfig=============');
    logger.debug(serveConfig);
    cb(serveConfig);
}

/**
 * 服务创建
 * @param token
 * @param network 网络配置
 * @param serverName  服务别名
 * @param userComposeName  服务名称
 * @param createParameter
 * @param conflevel
 * @param cb
 */
function serverCreate(token, network, serverName, userComposeName, createParameter, conflevel, cb) {
    async.waterfall([
        waterfallCallback=> {//获取服务配置
            generateServeConfig(serverName, userComposeName, createParameter, serveConfig=> {
                serveConfig.conflevel = conflevel;
                serveConfig.network = network.name;
                serveConfig.subdomain = network.name;
                serveConfig.networkid = network.id;
                waterfallCallback(null, serveConfig);
            });
        },
        (serveConfig, waterfallCallback)=> {//创建服务信息
            serveService.createByCompose(token, serveConfig, (err, serveConfig)=> {
                if (!err) {
                    waterfallCallback(null, serveConfig);
                } else {
                    waterfallCallback(err);
                }
            })
        }
    ], (err, serveConfig)=> {//根据服务信息启动容器
        if (!err) {
            logger.debug('yes~~~~');
            containerService.composeCreate(serveConfig.id, null, (err)=> {
                if (!err) {
                } else {
                    logger.info(err);
                }
            });
            cb(null);
        } else {
            logger.info(err);
            cb(err);
        }
    });

}

/**
 * 根据列表按顺序启动
 * @param composeName
 * @param startList
 * @param createDatas
 * @param confLevel
 * @param token
 * @param callback
 */
function startByList(composeName, startList, createDatas, confLevel, token, callback) {
    let startFirst = startList.startFirst,
        startLater = startList.startLater,
        suffix = stringUtil.randomString(5);
    async.waterfall([
        waterfallCallback=> {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);//触发下一步
                    } else {
                        waterfallCallback(err);
                    }
                } catch (e) {
                    waterfallCallback("token获取用户信息失败" + e);
                }
            });
        },
        (userId, waterfallCallback)=> {
            userDao.get(userId, function (err, result) {
                try {
                    if (!err) {
                        logger.debug(moment().format('h:mm:ss') + '   获取用户基本信息成功');
                        let networkName = result.people.profile.sub_domain + "." + composeName + ".app";
                        waterfallCallback(null, networkName);//触发下一步
                    } else {
                        waterfallCallback(err);
                    }
                } catch (e) {
                    waterfallCallback('networkAndSubdomain  ' + e);
                }
            });
        },
        (networkName, waterfallCallback)=> {//创建覆盖网络
            docker.createNetwork(networkName).then(res=> {
                logger.debug(res);
                let networkConfig = {
                    "HostConfig": {
                        "NetworkMode": res.Id
                    }
                };
                let network = {
                    name: networkName,
                    id: res.Id,
                    config: networkConfig
                };
                waterfallCallback(null, network);
            }).catch(e=> {
                waterfallCallback('createNetwork err ' + e);
            });
        },
        (network, waterfallCallback)=> {
            startFirst.forEach(serverName=> {//启动容器
                logger.debug('startFirst serverName ' + serverName);
                let createParameter = createDatas.get(serverName);
                let userComposeName = composeName + '-' + serverName + '-' + suffix;//服务名
                createParameter = _.defaultsDeep(createParameter, network.config);
                serverCreate(token, network, serverName, userComposeName, createParameter, confLevel, err=> {
                    if (!err) {
                        waterfallCallback(null, network);
                    } else {
                        waterfallCallback('startFirst err ' + err);
                    }
                });
            });
        },
        (network, waterfallCallback)=> {
            if (startLater.length > 0) {
                startLater.forEach(serverName=> {
                    let createParameter = createDatas.get(serverName);
                    let userComposeName = composeName + '-' + serverName + '-' + suffix;//服务名
                    createParameter = _.defaultsDeep(createParameter, network.config);
                    serverCreate(token, network, serverName, userComposeName, createParameter, confLevel, err=> {
                        if (!err) {
                            waterfallCallback(null);
                        } else {
                            waterfallCallback('startFirst err ' + err);
                        }
                    });
                });
            } else {
                waterfallCallback(null);
            }
        }
    ], err=> {
        if (err) {
            logger.error(err);
            callback(err);
        } else {
            callback(null);
        }
    });
}


/**
 *根据compose文件部署服务
 * @param composeName
 * @param composeJson
 * @param token
 * @param confLevel
 * @param callback
 */
function composeStart(composeName, composeJson, token, confLevel, callback) {
    try {
        composeParser(composeJson, (startList, createDatas)=> {
            try {
                startByList(composeName, startList, createDatas, confLevel, token, callback);
            } catch (e) {
                logger.info(e);
            }
        });
    } catch (e) {
        logger.info(e);
    }
}

/**
 * 根据composeId从数据库取出数据创建服务
 * @param composeId
 * @param confLevel
 * @param token
 * @param callback
 */
function serverByComposeId(composeId, confLevel, token, callback) {
    async.waterfall([
        waterfallCallback=> {//根据composeId获取compose信息
            getComposeById(composeId, (err, data)=> {
                waterfallCallback(err, data);
            });
        },
        (data, waterfallCallback)=> {//把compose信息解析成启动参数
            composeParser(data.composeJson, (startList, createDatas)=> {
                try {
                    waterfallCallback(null, data, startList, createDatas);
                }
                catch (e) {
                    waterfallCallback(e);
                }

            });
        },
        (data, startList, createDatas, waterfallCallback)=> {//创建服务，启动容器
            startByList(data.composeName, startList, createDatas, confLevel, token, (err)=> {
                waterfallCallback(err);
            });
        }
    ], e=> {
        if (!e) {
            callback(null);
        } else {
            logger.error(e);
            callback(e);
        }
    });
}

/**
 * 根据id读取compose详情
 * @param composeId
 * @param callback
 */
function getComposeById(composeId, callback) {
    composeDao.getComposeByID(composeId)
        .then(res=> {
            callback(null, res.compose);
        })
        .catch(e=> {
            callback(e.info);
        });
}

/**
 * 保存compose文件
 * @param token
 * @param composeName
 * @param composeJson
 * @param cb
 */
function saveCompose(token, composeName, composeJson, cb) {
    async.waterfall([
        waterfallCb=> {
            userDao.getIdByToken(token, (err, result)=> {
                if (!err) {
                    waterfallCb(null, result.id);
                } else {
                    waterfallCb(err);
                }
            });
        },
        (userId, waterfallCb)=> {
            let compose = {
                id: uuid.v4(),
                composeName: composeName,
                ownerid: userId,
                composeJson: composeJson,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            composeDao.saveCompose(compose)
                .then(res=> {
                    logger.debug(res);
                    waterfallCb(null);
                })
                .catch(e=> {
                    waterfallCb(e);
                });
        }
    ], err=> {
        if (!err) {
            cb(null);
        } else {
            logger.debug(err);
            cb(err);
        }

    });
}

/**
 * 根据compose id 修改compose
 *
 * @param newCompose ={composeId , composeName , composeJson}
 *
 * @param callback
 */
function updateComposeById(newCompose, callback) {
    async.waterfall([
            waterfallCb=> {
                composeDao.getComposeByID(newCompose.composeId)
                    .then(data=> {
                        waterfallCb(null, data.compose);
                    })
                    .catch(e=> {
                        waterfallCb(e);
                    });
            },
            (oldCompose, waterfallCb)=> {
                oldCompose.composeName = newCompose.composeName;
                oldCompose.composeJson = newCompose.composeJson;
                composeDao.updateCompose(oldCompose)
                    .then(data=> {
                        logger.debug(data);
                        waterfallCb(null);
                    })
                    .catch(e=> {
                        waterfallCb(e);
                    });
            }
        ],
        err=> {
            if (!err) {
                callback(null);
            }
            callback(err);
        });
}

/**
 * 读取compose文件
 * @param token
 * @param cb
 */
function getCompose(token, cb) {
    async.waterfall([
        waterfallCb=> {
            userDao.getIdByToken(token, (err, result)=> {
                if (!err) {
                    waterfallCb(null, result.id);
                } else {
                    waterfallCb(err);
                }
            });
        },
        (userId, waterfallCb)=> {
            composeDao.getComposeByUserId(userId)
                .then(res=> {
                    logger.debug(res);
                    waterfallCb(null, res);
                })
                .catch(e=> {
                    waterfallCb(e);
                });
        }
    ], (err, data)=> {
        if (!err) {
            cb(null, data);
        } else {
            cb(err);
        }
    });
}

/**
 * 根据id删除compose
 * @param composeId
 * @param callback
 */
function deleteComposeById(composeId, callback) {
    composeDao.deleteComposeById(composeId)
        .then(data=> {
            logger.debug(data);
            callback(null);
        })
        .catch(e=> {
            callback(e);
        });
}

function getpublicCompose(callback) {
    composeDao.getPublicCompose()
        .then(data=> {
            logger.debug(data);
            callback(null);
        })
        .catch(e=> {
            callback(e);
        });
}

module.exports = {
    getCompose,
    saveCompose,
    updateComposeById,
    composeStart,
    serverByComposeId,
    deleteComposeById,
    getpublicCompose
};