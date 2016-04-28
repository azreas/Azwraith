/**
 * 调用底层服务 容器 API
 * Created by xzj on 2016/4/25 0025.
 */


var rest = require('restler');
var dockerservice = require('../settings').dockerservice;
var dockerConfig = require("../settings").dockerConfig;


/**
 * 保存容器配置
 * @param container
 * @param callback
 */
exports.save = function (container, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/container', container).on('complete', function(data, response) {
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
 * 根据appid读取container列表
 * @param appid
 * @param callback
 */
exports.listByAppid = function (appid, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/containers/'+appid).on('complete', function(data, response) {
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
 * 根基containerid读取container详细信息
 * @param id
 * @param callback
 */
exports.get = function (id, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/container/'+id).on('complete', function(data, response) {
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
 * 更新container信息
 * @param container
 * @param callback
 */
exports.update = function (container, callback) {
    rest.putJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/container', container).on('complete', function(data, response) {
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
 * 保存容器事件信息
 * @param event
 * @param callback
 */
exports.saveEvent = function (event, callback) {
    rest.postJson('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/containerevent', event).on('complete', function(data, response) {
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
 * 根据容器id查询事件信息
 * @param id
 * @param callback
 */
exports.getEvent = function (id, callback) {
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/containerevent/'+id).on('complete', function(data, response) {
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
 * 根据容器配置创建容器实例
 * @param containerOpts
 * @param callback
 */
exports.create = function (containerOpts, callback) {
    rest.postJson('http://'+dockerConfig.host+':'+dockerConfig.port+'/containers/create', containerOpts).on('complete', function(data, response) {
        try {
            if (response.statusCode !== 201) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};


/**
 * 根据容器 id 启动容器实例
 * @param id
 * @param callback
 */
exports.start = function (id, callback) {
    rest.postJson('http://'+dockerConfig.host+':'+dockerConfig.port+'/containers/'+id+'/start').on('complete', function(data, response) {
        try {
            if (response.statusCode !== 204) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};


/**
 * 根据容器 id 停止容器实例
 * @param id
 * @param callback
 */
exports.stop = function (id, callback) {
    rest.postJson('http://'+dockerConfig.host+':'+dockerConfig.port+'/containers/'+id+'/stop').on('complete', function(data, response) {
        try {
            if (response.statusCode !== 204) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};


/**
 * 根据容器 id 获取 docker 容器的详细信息
 * @param id
 * @param callback
 */
exports.inspect = function (id, callback) {
    rest.get('http://'+dockerConfig.host+':'+dockerConfig.port+'/containers/'+id+'/json').on('complete', function(data, response) {
        try {
            if (response.statusCode !== 200) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};


/**
 * 根据容器 id 删除 docker 容器实例
 * @param id
 * @param callback
 */
exports.remove = function (id, callback) {
    rest.del('http://' + dockerConfig.host + ':' + dockerConfig.port + '/containers/' + id + '?v=1&force=1').on('complete', function (data, response) {
        try {
            if (response.statusCode !== 204) {
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};
























