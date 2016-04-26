/**
 * 验证是否已登录
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var token = "9ea884eb-3ad6-4bd1-89dc-b21957dabe65";
userService.checkLogin(token, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});