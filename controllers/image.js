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
    var imageName = req.body.imgFirst + '/' + req.body.imgLast;
    var gitAddress = req.body.repoUrl;
    var tag = req.body.repoType;
    var detail = req.body.ciSummary;
    var dockerfilePath;
    var path = req.body.dockerfilePath;
    if (path) {
        dockerfilePath = '.' + path;
    } else {
        dockerfilePath = '.';
    }
    try {
        var userId;
        var creatDate;
        var imageId = uuid.v4();
        creatDate = new Date().getTime();
        async.waterfall([
            //获取用户ID
            function (waterfallCallback) {
                userDao.getIdByToken(req.cookies.token, function (err, data) {
                    userId = data.id
                    waterfallCallback(err);
                });
            },
            //保存构建镜像信息
            function (waterfallCallback) {
                var buildImage = {
                    "id": imageId,
                    "name": imageName,
                    "detail": detail,
                    "tag": tag,
                    "status": 0,//镜像构建状态 0 构建中 1 构建成功 -1 构建失败
                    "ownerid": userId,
                    "createdate": creatDate,
                    "updatedate": creatDate
                };
                imageDao.saveBuildImage(buildImage, function (err) {
                    waterfallCallback(err);
                });
            },
            //构建镜像
            function (waterfallCallback) {
                imageService.buildImage(imageName, gitAddress, dockerfilePath, function (err) {
                    waterfallCallback(err);
                });
            },
            //将镜像推进公有仓库
            function (waterfallCallback) {
                imageService.pushImageOnPublicRegistry(imageName, tag, function (err, imageName) {
                    waterfallCallback(err, imageName);
                });
            }
        ], function (error, imageName) {
            var status;
            if (!error) {
                status = 1;
            } else {
                status = -1;
                logger.info(error);
            }
            //修改构建镜像状态
            var buildImage = {
                "id": imageId,
                "name": imageName,
                "detail": detail,
                "tag": tag,
                "status": status,
                "err": err,
                "ownerid": userId,
                "createdate": creatDate,
                "updatedate": new Date().getTime()
            }
            imageDao.updateBuildImage(buildImage, function (err, data) {
                if (!err) {
                    res.json({result: true, error: err});
                } else {
                    res.json({result: false, error: err});
                    logger.info(err);
                }
            });
        });
    } catch (e) {
        logger.info(e);
        next(e);
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
                userDao.getIdByToken(req.cookies.token, function (err, data) {
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