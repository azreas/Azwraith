/**
 * Created by xzj on 2016/6/28 0028.
 */
'use strict';
let composeParser = require('../modules/parser');
let docker = require('../dao/docker');
let async = require('async');
let _ = require('lodash');
let userDao = require('../dao/user');
let composeDao = require('../dao/compose');
let uuid = require('node-uuid');
let logger = require("../modules/log/log").logger();
let moment = require('moment');

function startByList(name, startList, createDatas, callback) {
    let startFirst = startList.startFirst,
        startLater = startList.startLater,
        networkConfig = {
            "HostConfig": {
                "NetworkMode": name
            }
        };
    async.waterfall([
        waterfallCallback=> {
            docker.createNetwork(name).then(res=> {
                logger.debug(res);
                waterfallCallback(null);
            }).catch(e=> {
                waterfallCallback('createNetwork err ' + e);
            });
        },
        waterfallCallback=> {
            let startCount = 0;
            startFirst.forEach(serverName=> {
                let createParameter = createDatas.get(serverName);
                createParameter = _.defaultsDeep(createParameter, networkConfig);
                docker.createContainer(createParameter, name + '-' + serverName).then(res=> {
                    logger.debug(res);
                    return docker.startContainer(res.Id);
                }).then(res=> {
                    logger.debug(res);
                    startCount++;
                    if (startCount === startFirst.length) {
                        waterfallCallback(null);
                    }
                }).catch(e=> {
                    waterfallCallback('startFirst err ' + e);
                });
            });
        },
        waterfallCallback=> {
            if (startLater.length > 0) {
                let startCount = 0;
                startLater.forEach(serverName=> {
                    let createParameter = createDatas.get(serverName);
                    createParameter = _.defaultsDeep(createParameter, networkConfig);
                    docker.createContainer(createParameter, name + '-' + serverName).then(res=> {
                        logger.debug(res);
                        return docker.startContainer(res.Id);
                    }).then(res=> {
                        logger.debug(res);
                        startCount++;
                        if (startCount === startFirst.length) {
                            waterfallCallback(null);
                        }
                    }).catch(e=> {
                        waterfallCallback('startLater err ' + e);
                    });
                });
            } else {
                waterfallCallback(null);
            }
        }
    ], err=> {
        if (err) {
            logger.info(err);
            callback(err);
        } else {
            callback(null);
        }
    });
}
/**
 * 根据compose文件部署服务
 * @param name
 * @param composeJson
 * @param callback
 */
exports.serverCompose = function (name, composeJson, callback) {
    try {
        composeParser(composeJson, (startList, createDatas)=> {
            try {
                startByList(name, startList, createDatas, callback);
            } catch (e) {
                logger.info(e);
            }
        });
    } catch (e) {
        logger.info(e);
    }
};


function saveCompose(token, composeName, compose, cb) {
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
            let composeJson = {
                id: uuid.v4(),
                name: composeName,
                ownerid: userId,
                compose: compose,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            composeDao.saveCompose(composeJson)
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

function updateCompose() {

    async.waterfall([
            waterfallCb=> {

            },
            waterfallCb=> {

            }
        ],
        err=> {

        })
}

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
    })
}


module.exports = {
    getCompose,
    saveCompose
};