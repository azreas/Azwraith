/**
 * 根据用户id 获取用户服务list
 * Created by lingyuwang on 2016/4/26.
 */

var serveService = require("../../../dao/serve");

var uid = "39ccf9c0-1678-11e6-9b14-b1d7a88afb92";
serveService.listByUid(uid, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});






