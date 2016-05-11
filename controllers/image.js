/**
 * 镜像控制层
 * Created by xzj on 2016/5/10 0010.
 */

var imageService = require('../service/image');

/**
 * 根据条件获取镜像列表
 * @param req
 * @param res
 * @param next
 */
exports.listByQuery = function (req, res, next) {
    var condition = {
        "type": req.params.type,
        "kind": req.params.kind,
        "label": req.params.label
    };
    imageService.listByCondition(condition, function (err, result) {
        if (!err) {
            res.json(result);
        } else {
            next(err);
        }
    });
};