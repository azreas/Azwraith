/**
 * Created by xzj on 2016/6/13 0013.
 */
var imageDao = require("../../../dao/image");
var userId = '963b72f0-19f1-11e6-b2c6-c9e47b5ca1dd';
imageDao.getBuildImageByUserId(userId, function (err, data) {
    console.log(err);
    console.log(data);
});