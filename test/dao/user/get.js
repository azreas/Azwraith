/**
 * 根据用户 id 获取用户基本信息
 * Created by lingyuwang on 2016/4/25.
 */

var userService = require("../../../dao/user");

var id = "6afad05c-dd75-414e-89cc-bb948895f455";
userService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
















