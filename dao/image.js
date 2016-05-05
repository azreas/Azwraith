/**
 * 调用底层服务 镜像 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var dockerservice = require('../settings').dockerservice;


/**
 * 查询全部镜像
 * @param callback
 */
exports.listAll = function (callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/image').on('complete', function (data, response) {
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
 * 检查镜像
 * @param imagesName
 * @param callback
 */
exports.inspect = function (imagesName, callback) {
    rest.get('http://' + dockerapitest.host + ':' + dockerapitest.port + '/images/' + imagesName + '/json').on('complete', function (data, response) {
        if (result instanceof Error) {
            console.log('Error:', result.message);
            this.retry(5000); // try again after 5 sec
        } else {
            console.log(response.statusCode);
            console.log(result);
        }
        try {
            if (response.statusCode === 200) {
                return callback(null, 200);
            } else {
                return callback(response.statusCode);
            }
        } catch (e) {
            return callback(e);
        }
    });
}




exports.pullImage = function (imagesName, callback) {
    rest.get('http://' + dockerapitest.host + ':' + dockerapitest.port + '/images/' + imagesName + '/json').on('complete', function (data, response) {
        if (result instanceof Error) {
            console.log('Error:', result.message);
            this.retry(5000); // try again after 5 sec
        } else {
            console.log(response.statusCode);
            console.log(result);
        }
        try {
            if (response.statusCode === 200) {
                return callback(null, 200);
            } else {
                return callback(response.statusCode);
            }
        } catch (e) {
            return callback(e);
        }
    });
}