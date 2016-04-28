/**
 * 根据服务 id 获取服务信息
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var id = "91b20b3c-7d81-4f2a-a5a4-93e39d0103f5";
serveService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



