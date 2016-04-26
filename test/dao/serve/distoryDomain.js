/**
 * 删除子域名映射API
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var domain = "testdomain";
serveService.distoryDomain(domain, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});