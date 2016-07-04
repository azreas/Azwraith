/**
 * Created by xzj on 2016/5/13 0013.
 */

var serveService = require("../../../service/serve");

var appid = 'b2075675-3678-45de-8725-5001a0a7b258';

serveService.removeDomainByAppid(appid, function (err) {
    console.log(err);
});