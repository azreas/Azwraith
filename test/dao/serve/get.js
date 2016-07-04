/**
 * 根据服务 id 获取服务信息
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var id = "af9486e1-30ef-4e20-9eca-86ff12869fc8";
serveService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



