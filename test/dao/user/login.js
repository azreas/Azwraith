/**
 * 用户登录
 * Created by lingyuwang on 2016/4/28.
 */


var userService = require("../../../dao/user");

var user = {
    account : {
        email:"xzj@163.com",
        password:"zxc123"
    }
};
userService.login(user, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
