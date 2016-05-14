/**
 * Created by xzj on 2016/5/15 0015.
 */
var multer = require('multer');
var userDao = require('../dao/user');
var async = require('async');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, '../public/upload')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        userDao.getIdByToken(req.cookies.token, function (err, result) {
            if (!err) {
                userDao.get(result.id, function (error, data) {
                    if (!err) {
                        cb(null, data.people.profile.sub_domain + "." + fileFormat[fileFormat.length - 1]);
                    } else {
//todo
                    }
                });
            } else {
//todo
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