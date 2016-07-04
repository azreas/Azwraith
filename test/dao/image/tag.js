/**
 * Created by xzj on 2016/6/13 0013.
 */
var imageDao = require("../../../dao/image");
var imageName = 'xzj/nnn1'
    , repo = '192.168.1.142/azwraith'
    , tag = '0';
imageDao.tag(imageName, tag, function (err, data) {
    console.log(err);
    console.log(data);
})