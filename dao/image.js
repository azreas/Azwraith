/**
 * 调用底层服务 镜像 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var http = require('http');
var dockerservice = require('../settings').dockerservice;
var dockerConfig = require('../settings').dockerConfig;
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
 * @param imagesName
 * @param callback(err,data)  err: 1-拉取失败
 */
exports.pullImage = function (imageName, tag, callback) {
    var options = {
        hostname: dockerConfig.host,
        port: 3375,
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
}