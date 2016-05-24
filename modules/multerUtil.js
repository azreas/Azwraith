/**
 * Created by xzj on 2016/5/15 0015.
 */
var multer = require('multer');
var userDao = require('../dao/user');
var async = require('async');
var path = require('path');
var logger = require("../log/log").logger();
var fs = require("fs");
var storage = multer.diskStorage({
    //设置上传后文件路径，upload文件夹会自动创建。
    destination: function (req, file, cb) {
        var upload_dir = path.join(__dirname, "../public/upload");
        // 检查 upload 文件夹是否存在，不存在则自动生成
        if (!fs.existsSync(upload_dir)) {
            fs.mkdirSync(upload_dir);
        }
        cb(null, upload_dir)
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        userDao.getIdByToken(req.cookies.token, function (err, result) {
            if (!err) {
                userDao.get(result.id, function (error, data) {
                    var putdata = {
                        uid: result.id,
                        avatarname: data.people.profile.sub_domain + "." + fileFormat[fileFormat.length - 1]
                    };
                    if (!err) {
                        if (data.people.profile.avatarname != null) {
                            var upload_dir = path.join(__dirname, "../public/upload");
                            fs.unlink(upload_dir + data.people.profile.avatarname, function (err) {
                                if (err) {
                                    logger.info("Delete image failed.");
                                    logger.info(err);
                                } else {
                                    logger.debug("Delete image success.");
                                }
                            });
                            userDao.avatarname(putdata, function (err, data) {
                                if (!err) {
                                    cb(null, putdata.avatarname);
                                }
                                else {
                                    // logger.error(err);
                                }
                            })
                        }
                        else {
                            userDao.avatarname(putdata, function (err, data) {
                                if (!err) {
                                    cb(null, putdata.avatarname);
                                }
                                else {
                                    // logger.error(err);
                                }
                            })
                        }
                    } else {
//todo
//                         logger.error(err);
                    }
                });
            } else {
//todo
//                 logger.error(err);
            }
        });
    }
});
//添加配置文件到muler对象。
var upload = multer({
    storage: storage
});

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage: storage,
//    limits:{}
// });

//导出对象
module.exports = upload;