/**
 * 根据容器 id 启动容器实例
 * Created by lingyuwang on 2016/4/26.
 */

var containerService = require("../../../dao/container");

var id = "b1c08fddb8e59920c5acf63c10678a3739eb0d1b7b776749e7be3cb551e7d202";
containerService.start(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
});