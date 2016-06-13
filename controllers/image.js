/**
 * 镜像控制层
 * Created by xzj on 2016/5/10 0010.
 */

var imageService = require('../service/image');
var userDao = require('../dao/user');
var imageDao = require('../dao/image');
var logger = require("../modules/log/log").logger();
var async = require('async');
var uuid = require('node-uuid');

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

/**
 * 镜像构建
 * 1.去git仓库下载代码构建镜像
 * 2.保存镜像信息到数据库
 * 3.将镜像推到公有或私有仓库
 * @param req
 * @param res
 * @param next
 */
exports.buildImage = function (req, res, next) {
    var imageName = req.body.imageName;
    var gitAddress = req.body.gitAddress;
    var tag = req.body.tag;
    var detail = req.body.detail;
    try {
        async.waterfall([
            function (waterfallCallback) {
                imageService.buildImage(imageName, gitAddress, function (err) {
                    waterfallCallback(err);
                });
            },
            function (waterfallCallback) {
                imageService.pushImageOnPublicRegistry(imageName, tag, function (err) {
                    waterfallCallback(err);
                });
            },
            function (waterfallCallback) {
                userDao.getIdByToken(req.cookies.token, function (err, data) {
                    waterfallCallback(err, data.id);
                });
            },
            function (userId, waterfallCallback) {
                var buildImage = {
                    "id": uuid.v4(),
                    "name": imageName,
                    "detail": detail,
                    "tag": tag,
                    "ownerid": userId,
                    "createdate": new Date().getTime()
                }
                imageDao.saveBuildImage(buildImage, function (err, data) {
                    waterfallCallback(err);
                });
            }
        ], function (err) {
            if (!err) {
                res.json({result: true});
            } else {
                logger.info(err)
                res.json({result: false});
            }
        });
    } catch (e) {
        logger.info(e);
        next(e)
    }
};

/**
 * 获取已构建的镜像
 * @param req
 * @param res
 * @param next
 */
exports.getBuildImage = function (req, res, next) {
    try {
        async.waterfall([
            function (waterfallCallback) {
                userDao.getIdByToken(req.cookie.token, function (err, data) {
                    waterfallCallback(err, data.id)
                });
            },
            function (userId, waterfallCallback) {
                imageDao.getBuildImageByUserId(userId, function (err, images) {
                    waterfallCallback(err, images);
                });
            }
        ], function (err, images) {
            if (!err) {
                res.json(images);
            }
            else {
                res.json(null);
            }
        });
    } catch (e) {
        logger.info(e);
        next(e);
    }
};