/**
 * 注册用户
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var user = {
    account: {
        email:"lyw@qq.com",
        password: "123456"
    }
}
userService.insert(user, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});


