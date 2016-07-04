/**
 * 根据用户 id 获取用户基本信息
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var id = "e4db4100-1722-11e6-a3f5-1fbbb51888b5";
userService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
















