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
exports.listByLabelAndKind = function (condition, callback) {
    // 若 label 和 kind 为 空
    if (!condition || (!condition.label && !condition.kind)) {
        return imageDao.listAll(callback);
    }
    // TODO
}