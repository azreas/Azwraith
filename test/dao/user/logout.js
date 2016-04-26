/**
 * 根据 token 登出
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var token = "792fb33b-14bb-48c0-96a0-75a5fd2a1e40";
userService.logout(token, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



