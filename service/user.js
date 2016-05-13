/**
 * 用户业务
 * Created by lingyuwang on 2016/4/26.
 */


var userDao = require('../dao/user');
var async = require("async");
var logger = require("../modules/log/log").logger();
/**
 * 根据 token 登出
 * @param token
 * @param callback
 */
exports.logout = function (token, callback) {
    return userDao.logout(token, callback);
};


/**
 * 根据用户 id 获取用户基本信息
 * @param id
 * @param callback
 */
exports.get = function (id, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {

                }
            });
        }, function (uid, waterfallCallback) {
            userDao.get(uid, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('get   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('get   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });


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
exports.changeinfo = function (token, profile, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }, function (uid, waterfallCallback) {
            var putdata = {
                "uid": uid,
                "profile": profile

            };
            userDao.changeinfo(putdata, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('changeinfo   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('changeinfo   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });
};

/**
 * 修改密碼
 * @param putdata
 * @param callback
 */
exports.changepassword = function (putdata, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }, function (uid, waterfallCallback) {
            putdata.uid = uid;
            userDao.changepassword(putdata, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('changepassword   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('changepassword   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });
};

/**
 * 发送邮箱验证连接
 * @param putdata
 * @param callback
 */
exports.mailverify = function (token, postdata, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        },
        function (uid, waterfallCallback) {
            postdata.uid = uid;
            userDao.changepassword(postdata, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('changepassword   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('changepassword   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });
};

/**
 * 发送短信验证码
 * @param uid
 * @param tophone
 * @param callback
 */
exports.sendSNSverify = function (token, tophone, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        },
        function (uid, waterfallCallback) {
            userDao.sendSNSverify(uid, tophone, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('sendSNSverify   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('sendSNSverify   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });
};


/**
 * 验证短信验证码
 * @param uid
 * @param tophone
 * @param callback
 */
exports.verifySNS = function (token, phonecode, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.error('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        },
        function (uid, waterfallCallback) {
            userDao.verifySNS(uid, phonecode, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.error('verifySNS   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('verifySNS   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err) {
        return callback(err, data);
    });
};










