/**
 * 根据配置名称查询配置信息
 * Created by lingyuwang on 2016/4/26.
 */

var serveService = require("../../../dao/serve");

var conflevel = "1x";
serveService.getSetmealByConflevel(conflevel, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});


