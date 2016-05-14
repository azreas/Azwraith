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
    rest.postJson('http://' + userservice.host + ':' + userservice.port + '/v1/people/', user).on('complete', function (data, response) {
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
    rest.del('http://' + userservice.host + ':' + userservice.port + '/v1/auth/' + token).on('complete', function (data, response) {
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
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/' + id).on('complete', function (data, response) {
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
 * 根据 token 获取 uid
 * @param token
 * @param callback
 */
exports.getIdByToken = function (token, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/auth/' + token).on('complete', function (data, response) {
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
 * 登录
 * @param user
 * @param callback
 */
exports.login = function (user, callback) {
    rest.postJson('http://' + userservice.host + ':' + userservice.port + '/v1/auth/', user).on('complete', function (data, response) {
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
 * 修改people信息
 * @param uid
 * @param profile
 * @param callback
 */
exports.changeinfo = function (putdata, callback) {
    rest.putJson('http://' + userservice.host + ':' + userservice.port + '/v1/people/', putdata).on('complete', function (data, response) {
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
 * 修改用戶密碼
 * @param putdata
 * @param callback
 */
exports.changepassword = function (putdata, callback) {
    rest.putJson('http://' + userservice.host + ':' + userservice.port + '/v1/people/passwd/', putdata).on('complete', function (data, response) {
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

exports.mailverify = function (postdata, callback) {
    rest.postJson('http://' + userservice.host + ':' + userservice.port + '/v1/people/mailverify/', postdata).on('complete', function (data, response) {
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


exports.sendSNSverify = function (uid, tophone, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/' + uid + '?tophone=' + tophone).on('complete', function (data, response) {
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


exports.verifySNS = function (uid, phonecode, callback) {
    rest.post('http://' + userservice.host + ':' + userservice.port + '/v1/people/' + uid + '?phonecode=' + phonecode, null).on('complete', function (data, response) {
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
 * 上传头像
 * @param uid
 * @param phonecode
 * @param callback
 */
exports.avatarupload = function (uid, phonecode, callback) {
    rest.post('http://' + userservice.host + ':' + userservice.port + '/v1/people/avatarupload/' + uid , null).on('complete', function (data, response) {
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

exports.getavatar = function (id, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/avatarupload/' + id).on('complete', function (data, response) {
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