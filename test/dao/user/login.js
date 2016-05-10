/**
 * 用户登录
 * Created by lingyuwang on 2016/4/28.
 */


var userService = require("../../../dao/user");

var user = {
    account : {
        email:"hechangtest@163.com",
        password:"hechang"
    }
};
userService.login(user, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
