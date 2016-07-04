/**
 * Created by xzj on 2016/6/14 0014.
 */
var imageDao = require("../../../dao/image");

var buildImage = {
    "id": 'testid',
    "name": 'testname',
    "detail": 'testdetail',
    "status": '2',
    "tag": 'test',
    "ownerid": 'iii',
    // "createdate": new Date().getTime(),
    "updatedate": new Date().getTime()
}
imageDao.updateBuildImage(buildImage, function (err, data) {
    console.log(err);
    console.log(data);
});