/**
 * Created by xzj on 2016/6/13 0013.
 */
var imageService = require("../../../service/image");
var imageName = 'alexwhen/docker-2048';
var tag = 'aq';
imageService.pushImageOnPublicRegistry(imageName, tag, function (err) {
    console.log(err);
})