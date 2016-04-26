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
    rest.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/image').on('complete', function(data, response) {
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
