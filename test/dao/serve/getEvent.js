/**
 * 根据服务 id 获取事件
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var id = "bfacccc0-b1aa-4c9f-86a6-c85bd9983a8c";
serveService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
