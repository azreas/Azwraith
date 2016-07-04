/**
 * 根据 token 登出
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var token = "2160e6c0-1750-11e6-967f-7f975921c00d";
userService.logout(token, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



