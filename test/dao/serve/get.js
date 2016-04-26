/**
 * 根据服务 id 获取服务信息
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var id = "a9fa93d3-17e5-4e3e-bbec-e4d2c327f38e";
serveService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



