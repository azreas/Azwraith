/**
 * Created by xzj on 2016/5/11 0011.
 */
var userService = require("../../../dao/user");

var id = "be4c4c50-172c-11e6-a1cc-27b85716e397";
userService.getIdByToken(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});