/**
 * 调用底层服务 镜像 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var http = require('http');
var dockerservice = require('../settings').dockerservice;
var dockerConfig = require('../settings').dockerConfig;
var buildService = require('../settings').buildService;
var registry = require('../settings').registry;
var logger = require("../modules/log/log").logger();

/**
 * 根据条件查询镜像 （数据库）
 * @param queryParameters
 * @param callback
 */
exports.list = function (queryParameters, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/image?' + queryParameters).on('complete', function (data, response) {
        // try {
        //     if (data.result !== true) {
        //         throw new Error(data.info.script);
        //     }
        // } catch (e) {
        //     return callback(e.message, data);
        // }
        return callback(null, data);
    });
}

/**
 * 检查镜像
 * @param imagesName
 * @param callback
 */
exports.inspect = function (imagesName, callback) {
    rest.get('http://' + dockerConfig.host + ':' + dockerConfig.port + '/images/' + imagesName + '/json').on('complete', function (data, response) {
        try {
            if (response.statusCode === 200) {
                return callback(null, data);
            } else {
                return callback(response.statusCode);
            }
        } catch (e) {
            return callback(e);
        }
    });
}


/**
 * 从DockerHub 拉取镜像
 * @param imageName
 * @param tag
 * @param callback(err,data)  err: 1-拉取失败
 */
exports.pullImage = function (imageName, tag, callback) {
    var options = {
        hostname: dockerConfig.host,
        port: dockerConfig.port,
        path: '/images/create?fromImage=' + imageName + '&tag=' + tag,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function (res) {
        logger.debug('pull image STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        if (res.statusCode === 200) {
            var nodeCount = 0;//记录节点数
            var pullSuccessCount = 0;//记录镜像拉取成功数
            var nodeID = [];//节点ID
            var pullStatus = false;//拉取状态
            res.on('data', function (chunk) {
                chunk = JSON.parse(chunk);
                logger.debug(chunk);
                // logger.debug(chunk.status);
                //记录文件层数和对应id
                if (chunk.status === 'Pulling ' + imageName + ':' + tag + '...') {
                    nodeID[nodeCount] = chunk.id;
                    nodeCount++;
                }
                if (chunk.status === 'Pulling ' + imageName + ':' + tag + '... : downloaded') {
                    pullSuccessCount++;
                }
            });
            res.on('end', function () {
                if (nodeCount === pullSuccessCount) {
                    logger.debug('拉取镜像成功');
                    callback(null);
                } else {
                    logger.info('拉取镜像失败');
                    callback(1);
                }
            });
        } else {
            callback(1);
        }
    });
    req.on('error', function (e) {
        logger.info('problem with request: ' + e.message);
        callback(e.message);
    });
    req.end();
};

/**
 * 镜像构建DAO层，连接服务器并执行命令
 * @param commands
 * @param callback
 */
exports.buildImage = function (commands, callback) {
    var err = null;
    var host = {
        // idleTimeOut: 15000,//超时定时器设置
        server: buildService,//主机配置
        commands: commands,//执行命令
        msg: {//构造消息
            send: function (message) {
                console.log(message);
            }
        },
        onCommandTimeout: function (command, response, stream, connection) {
            logger.info('commandTimeout command : ' + command);
            logger.info('commandTimeout response : ' + command);
            //git地址错误或需要验证
            if (command.indexOf("git clone") !== -1 && response.indexOf("Username") !== -1) {
                logger.info(response);
                err = 'git地址错误或需要验证';
                connection.end();
            }
        },
        //命令执行结束监听事件
        onCommandComplete: function (command, response, sshObj) {
            sshObj.msg.send(response);
            if (command.indexOf('git clone') !== -1) {
                if (response.indexOf('Checking connectivity... done.') === -1) {
                    logger.info('git clone fail');
                    err = 'git clone fail';
                    // return callback('git clone fail');
                }
            }
            if (command.indexOf('docker build') !== -1) {
                if (response.indexOf('Successfully built ') === -1) {
                    logger.info('build image fail');
                    err = 'build image fail';
                    // return callback('build image fail');
                }
            }
        },
        //连接结束监听事件
        onEnd: function (sessionText, sshObj) {
            if (sshObj.commands.length > 0 && !err) {
                err = 'build fail';
            }
            return callback(err);
        }
    };
    var SSH2Shell = require('ssh2shell'),
        SSH = new SSH2Shell(host);
    SSH.connect();
    //连接超时监听
    // SSH.on("commandTimeout", function onCommandTimeout(command, response, stream, connection) {
    //     logger.info('commandTimeout command : ' + command);
    //     logger.info('commandTimeout response : ' + command);
    //     //git地址错误或需要验证
    //     if (command.indexOf("git clone") !== -1 && response.indexOf("Username") !== -1) {
    //         logger.info(response);
    //         err = 'git地址错误或需要验证';
    //         connection.end();
    //         // return callback('git地址错误或需要验证');
    //     }
    // });
};

/**
 * 数据库保存构建镜像信息
 * @param buildImage
 * @param callback
 */
exports.saveBuildImage = function (buildImage, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/registry', buildImage).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data.info.script);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};

/**
 * 修改数据库保存构建镜像信息
 * @param buildImage
 * @param callback
 */
exports.updateBuildImage = function (buildImage, callback) {
    rest.putJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/registry', buildImage).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data.info.script);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
}

/**
 * 数据取出镜像信息
 * @param userId
 * @param callback
 */
exports.getBuildImageByUserId = function (userId, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/registry/' + userId).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data.info.script);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data.images);
    });
};

/**
 * 数据库删除保存的镜像信息
 * @param buildImageId
 * @param callback
 */
exports.delBuildImageById = function (buildImageId, callback) {
    rest.del('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/registry/' + buildImageId).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data.info.script);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};

/**
 * 修改镜像名称和标签
 *  201 – no error
 *  400 – bad parameter
 *  404 – no such image
 *  409 – conflict
 *  500 – server error
 * @param imageName 镜像名
 * @param tag       标签
 * @param callback
 */
exports.tag = function (imageName, tag, callback) {
    var newName = registry.host + ':' + registry.port + '/' + imageName;
    rest.postJson('http://' + buildService.host + ':' + buildService.docker_port + '/images/' + imageName + '/tag?repo=' + newName + '&tag=' + tag, null).on('complete', function (data, response) {
        try {
            if (response.statusCode !== 201) {
                throw new Error(response.statusCode);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, newName);
    });
};

/**
 * 将镜像推到镜像仓库
 * @param imageName 镜像名
 * @param callback
 */
exports.push = function (imageName, callback) {
    var options = {
        hostname: buildService.host,
        port: buildService.docker_port,
        path: '/images/' + imageName + '/push',
        method: 'POST',
        headers: {
            'X-Registry-Auth': {
                "username": "",
                "password": "",
                "email": ""
            }
        }
    };
    var req = http.request(options, function (res) {
        logger.debug('push image STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        if (res.statusCode === 200) {
            res.on('data', function (chunk) {
                // chunk = JSON.parse(chunk);
                logger.debug(chunk);
            });
            res.on('end', function () {
                callback(null);
            });
        } else {
            callback(res.statusCode);
        }
    });
    req.on('error', function (e) {
        logger.info('problem with request: ' + e.message);
        callback(e.message);
    });
    req.end();
};