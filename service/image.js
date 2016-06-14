/**
 * 镜像 业务
 * Created by lingyuwang on 2016/4/26.
 */


var imageDao = require('../dao/image');
var logger = require("../modules/log/log").logger();

/**
 * 根据 label 和 kind 获取镜像信息
 * @param condition
 * @param callback
 */
exports.listByCondition = function (condition, callback) {
    var queryParameters = '';
    if (condition.type) {
        queryParameters += 'type=' + condition.type;
    }
    if (condition.kind) {
        queryParameters += 'kind=' + condition.kind;
    }
    if (condition.label) {
        queryParameters += 'label=' + condition.label;
    }
    return imageDao.list(queryParameters, callback);
    // TODO
};


/**
 * 构建镜像
 * @param imageName
 * @param gitAddress
 * @param callback
 */
exports.buildImage = function (imageName, gitAddress, dockerfilePath, callback) {
    var commands = [
        'mkdir /imageBuild',
        'cd "$_"',
        'git clone ' + gitAddress + ' ' + imageName.replace(/\//g, '_'),
        'cd ' + imageName.replace(/\//g, '_'),
        'docker build -t ' + imageName + ' ' + dockerfilePath,
        'rm -r /imageBuild/' + imageName.replace(/\//g, '_')
    ];
    imageDao.buildImage(commands, function (err) {
        try {
            if (!err) {
                callback(null);
            } else {
                callback(err);
            }
        } catch (e) {
            logger.info(e);
            callback(e);
        }
    });
};

/**
 * 将镜像推到共有仓库
 * @param imageName
 * @param tag
 * @param callback
 */
exports.pushImageOnPublicRegistry = function (imageName, tag, callback) {
    imageDao.tag(imageName, tag, function (err, newName) {
        if (!err) {
            imageDao.push(newName, function (err) {
                if (!err) {
                    callback(null, newName);
                }
                else {
                    callback('push err :' + err);
                }
            });
        } else {
            callback('tag err : ' + err);
        }
    });
};

