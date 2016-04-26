/**
 * 根据appid读取container列表
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var appid = "7deed1db-7777-4de5-94ef-bf1b4af49eec";
containerService.listByAppid(appid, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});