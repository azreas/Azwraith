/**
 * 查询全部镜像
 * Created by lingyuwang on 2016/4/25.
 */

var imageService = require("../../../dao/image");

imageService.listAll(function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});


