/**
 * 根据 token 登出
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var token = "717cdce0-daf5-4226-b103-1b5cd68ac674";
userService.logout(token, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



