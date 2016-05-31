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
exports.get = function (token, callback) {

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
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
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
                        logger.info('changeinfo   uid  ' + uid + '   err   ' + err);
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
exports.changepassword = function (token, putdata, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
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
                        logger.info('changepassword   uid  ' + uid + '   err   ' + err);
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
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
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
            userDao.mailverify(postdata, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.info('mailverify   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('mailverify   uid  ' + uid + '   e   ' + e);
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
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
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
                        logger.info('sendSNSverify   uid  ' + uid + '   err   ' + err);
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
exports.verifySNS = function (token, phonecode, cellphone, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        },
        function (uid, waterfallCallback) {
            userDao.verifySNS(uid, phonecode, cellphone, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.info('verifySNS   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('verifySNS   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, data) {
        return callback(err, data);
    });
};

/**
 * 记录上传头像
 * @param token
 * @param callback
 */
exports.avatarupload = function (token, callback) {

    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        },
        function (uid, waterfallCallback) {
            userDao.get(uid, function (err, result) {
                try {
                    if (!err) {
                        var postdata = {
                            uid: uid,
                            headname: result.people.profile.sub_domain
                        }
                        waterfallCallback(null, postdata);
                    } else {
                        logger.error('get   uid  ' + uid + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('get   uid  ' + uid + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }, function (user, waterfallCallback) {
            userDao.avatarupload(postdata, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.info('avatarupload  err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(e);
                }
            });
        }
    ], function (err, upload) {
        return callback(err, data);
    });
};

exports.getavatar = function (token, callback) {
    async.waterfall([
        function (waterfallCallback) {
            userDao.getIdByToken(token, function (err, result) {
                try {
                    if (!err) {
                        waterfallCallback(null, result.id);
                    } else {
                        logger.info('getIdByToken  token   ' + token + '   err   ' + err);
                        waterfallCallback(err);
                    }
                } catch (e) {
                    logger.error('getIdByToken  token   ' + token + '   e   ' + e);
                    waterfallCallback(err);
                }
            });
        }, function (uid, waterfallCallback) {
            userDao.getavatar(uid, function (err, data) {
                try {
                    if (!err) {
                        waterfallCallback(null, data);
                    } else {
                        logger.info('get   uid  ' + uid + '   err   ' + err);
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


exports.usercode = function (callback) {
    return userDao.usecode(callback);
};


exports.verifycode = function (inviteCode, callback) {
    return userDao.verifycode(inviteCode, callback);
};


exports.delcode = function (inviteCode, callback) {
    return userDao.delcode(inviteCode, callback);
}

exports.issuedcode = function (callback) {
    return userDao.issuedcode(callback);
}