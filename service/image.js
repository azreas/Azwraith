/**
 * 镜像 业务
 * Created by lingyuwang on 2016/4/26.
 */


var imageDao = require('../dao/image');


/**
 * 根据 label 和 kind 获取镜像信息
 * @param condition
 * @param callback
 */
exports.listByCondition = function (condition, callback) {
    var queryParameters = '';
    if (condition.type) {
        queryParameters += 'type=' + condition.type;
    }
    if (condition.kind) {
        queryParameters += 'kind=' + condition.kind;
    }
    if (condition.label) {
        queryParameters += 'label=' + condition.label;
    }
    return imageDao.list(queryParameters, callback);
    // TODO
}