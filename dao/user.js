/**
 * 调用底层服务 用户 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var userservice = require('../settings').userservice;


/**
 * 注册用户
 * @param user
 * @param callback
 */
exports.insert = function (user, callback) {
    rest.postJson('http://' + userservice.host + ':' + userservice.port + '/v1/user', user).on('complete', function(data, response) {
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
 * 根据 token 登出
 * @param token
 * @param callback
 */
exports.logout = function (token, callback) {
    rest.del('http://' + userservice.host + ':' + userservice.port + '/v1/auth/'+token).on('complete', function(data, response) {
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
 * 根据用户 id 获取用户基本信息
 * @param id
 * @param callback
 */
exports.get = function (id, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/user/'+id).on('complete', function(data, response) {
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
 * 验证是否已登录
 * @param token
 * @param callback
 */
exports.checkLogin = function (token, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/auth/'+token).on('complete', function(data, response) {
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











