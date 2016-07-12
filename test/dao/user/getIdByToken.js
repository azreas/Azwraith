/**
 * Created by xzj on 2016/5/11 0011.
 */
var userService = require("../../../dao/user");

var token = "1b992c40-4714-11e6-8e7a-a1e76559a1f7";
userService.getIdByToken(token, function (err, data) {
    console.log("err ---> " + err);
    console.log(data);
    console.log(data.info);
});