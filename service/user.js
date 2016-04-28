/**
 * 用户业务
 * Created by lingyuwang on 2016/4/26.
 */


var userDao = require('../dao/user');


/**
 * 根据 token 登出
 * @param token
 * @param callback
 */
exports.logout = function (token, callback){
    return userDao.logout(token, callback);
};


/**
 * 根据用户 id 获取用户基本信息
 * @param id
 * @param callback
 */
exports.get = function (id, callback){
    return userDao.get(id, callback);
};


/**
 * 注册用户
 * @param user
 * @param callback
 */
exports.regist = function (user, callback) {
    return userDao.insert(user, callback);
};



















