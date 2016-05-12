/**
 * 根据容器 id 停止容器实例
 * Created by lingyuwang on 2016/4/26.
 */

var containerService = require("../../../dao/container");

var id = "b953a22496432306080aaf255aeb836d82cd2dbf6a04131404f5e765be455f75";
containerService.stop(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
});