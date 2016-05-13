/**
 * 用户业务
 * Created by lingyuwang on 2016/4/26.
 */


var userDao = require('../dao/user');
var async = require("async");


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


/**
 * 登录
 * @param user
 * @param callback
 */
exports.login = function (user, callback) {
    return userDao.login(user, callback);
};

/**
 * 修改用戶信息
 * @param putdata
 * @param callback
 */
exports.changeinfo = function (putdata, callback) {
    return userDao.changeinfo(putdata, callback);
};

/**
 * 修改密碼
 * @param putdata
 * @param callback
 */
exports.changepassword = function (putdata, callback) {
    return userDao.changepassword(putdata, callback);
};

/**
 * 发送邮箱验证连接
 * @param putdata
 * @param callback
 */
exports.mailverify = function (postdata, callback) {
    return userDao.changepassword(postdata, callback);
};

/**
 * 发送短信验证码
 * @param uid
 * @param tophone
 * @param callback
 */
exports.sendSNSverify = function (uid,tophone, callback){
    return userDao.get(uid,tophone, callback);
};










