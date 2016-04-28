/**
 * 根据 label 和 kind 获取镜像信息
 * Created by lingyuwang on 2016/4/28.
 */

var imageService = require("../../../service/image");

imageService.listByLabelAndKind(null, function (err, data) {
    console.log("error ---> "+err);
    console.log(data);
});