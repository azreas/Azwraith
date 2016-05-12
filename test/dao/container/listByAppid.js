/**
 * 根据appid读取container列表
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var appid = "98b62920-badc-4c63-9401-bf509a84fdfd";
containerService.listByAppid(appid, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});