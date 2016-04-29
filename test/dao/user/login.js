/**
 * 用户登录
 * Created by lingyuwang on 2016/4/28.
 */


var userService = require("../../../dao/user");

var user = {
    account : {
        email:"atest@qq.com",
        password:"123456as"
    }
};
userService.login(user, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
