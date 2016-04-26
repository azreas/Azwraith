/**
 * 根据用户id 获取用户服务list
 * Created by lingyuwang on 2016/4/26.
 */

var serveService = require("../../../dao/serve");

var uid = "893d6cc5-17cd-45ba-957a-e89e64097429";
serveService.listByUid(uid, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});






