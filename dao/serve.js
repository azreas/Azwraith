/**
 * 调用底层服务 服务 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var dockerservice = require('../settings').dockerservice;


/**
 * 保存服务配置
 * @param app
 * @param callback
 */
exports.save = function (app, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/app', app).on('complete', function(data, response) {
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
 * 根据服务 id 获取服务信息
 * @param id
 * @param callback
 */
exports.get = function (id, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/app/'+id).on('complete', function(data, response) {
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
 * 保存服务事件
 * @param event
 * @param callback
 */
exports.saveEvent = function (event, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/appevent', event).on('complete', function(data, response) {
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
 * 根据服务 id 获取事件
 * @param id
 * @param callback
 */
exports.getEvent = function (id, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/appevent/'+id).on('complete', function(data, response) {
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
 * 映射子域名API
 * @param domain
 * @param callback
 */
exports.createDomain = function (domain, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/domain', domain).on('complete', function(data, response) {
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
 * 删除子域名映射API
 * @param domain
 * @param callback
 */
exports.distoryDomain = function (domain, callback) {
    rest.del('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/domain/'+domain).on('complete', function(data, response) {
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
 * 根据用户id 获取用户服务list
 * @param uid
 * @param callback
 */
exports.listByUid = function (uid, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/server/'+uid).on('complete', function(data, response) {
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
 * 根据配置名称查询配置信息
 * @param conflevel
 * @param callback
 */
exports.getSetmealByConflevel = function (conflevel, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/setmeal/'+conflevel).on('complete', function(data, response) {
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






