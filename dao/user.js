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
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/SNSverify/' + uid + '?tophone=' + tophone).on('complete', function (data, response) {
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


exports.verifySNS = function (uid, phonecode, cellphone, callback) {
    rest.post('http://' + userservice.host + ':' + userservice.port + '/v1/people/SNSverify/' + uid + '?phonecode=' + phonecode + '&cellphone=' + cellphone, null).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data.info.code);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};

/**
 * 记录上传头像
 * @param uid
 * @param phonecode
 * @param callback
 */
exports.avatarupload = function (postdata, callback) {
    rest.post('http://' + userservice.host + ':' + userservice.port + '/v1/people/saveHeadName', postdata).on('complete', function (data, response) {
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
    rest.get('http://192.168.1.210:3001/v1/people/avatarupload/' + id).on('complete', function (data, response) {
        try {
            if (data.result !== true) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};

exports.avatarname = function (postdata, callback) {
    rest.putJson('http://' + userservice.host + ':' + userservice.port + '/v1/people/avatarname/', postdata).on('complete', function (data, response) {
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
 * 检查要不要邀请码
 */
exports.usecode = function (callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/regist/usecode').on('complete', function (data, response) {
        try {
            if (data.result !== true && data.result !== false) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};

/**
 * 验证邀请码
 *
 */
exports.verifycode = function (inviteCode, callback) {
    rest.get('http://' + userservice.host + ':' + userservice.port + '/v1/people/regist/verifycode/' + inviteCode).on('complete', function (data, response) {
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
 * 删除邀请码
 * @param inviteCode
 * @param callback
 */
exports.delcode = function (inviteCode, callback) {
    rest.del('http://' + userservice.host + ':' + userservice.port + '/v1/people/regist/delcode/' + inviteCode).on('complete', function (data, response) {
        try {
            if (data.result !== true && data.result !== false) {
                throw new Error(data.info.script);
            }
        } catch (e) {
            return callback(e.message, data);
        }
        return callback(null, data);
    });
};