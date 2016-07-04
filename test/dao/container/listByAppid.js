/**
 * 根据appid读取container列表
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var appid = "af9486e1-30ef-4e20-9eca-86ff12869fc8";
containerService.listByAppid(appid, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
    var containerId = [];
    var i = 0;
    data.containers.forEach(function (containers) {
        containerId[i++] = containers.id;
    });
    console.log(containerId);
});