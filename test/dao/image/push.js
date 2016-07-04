/**
 * Created by xzj on 2016/6/13 0013.
 */
var imageDao = require("../../../dao/image");
var imageName = '192.168.1.142:5000/busybox';
imageDao.push(imageName, function (err, data) {
    console.log(err);
    console.log(data);
})