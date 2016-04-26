/**
 * 映射子域名
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var domain = {
    subdomain : "testdomain"
};
serveService.createDomain(domain, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});