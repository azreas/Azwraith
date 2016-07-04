/**
 * Created by xzj on 2016/6/13 0013.
 */
var imageDao = require("../../../dao/image");

var buildImage = {
    "id": 'testid',
    "name": 'testname',
    "detail": 'testdetail',
    "status": '1',
    "tag": 'test',
    "ownerid": 'i',
    "createdate": new Date().getTime(),
    "updatedate": new Date().getTime()
}
imageDao.saveBuildImage(buildImage, function (err, data) {
    console.log(err);
    console.log(data);
});