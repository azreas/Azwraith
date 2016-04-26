/**
 * 保存服务事件
 * Created by lingyuwang on 2016/4/25.
 */

var serveService = require("../../../dao/serve");

var uuid = require('node-uuid');

var event = {
    appid: uuid.v4(),
    event: "测试",
    titme: new Date().getTime(),
    script: ""
};
serveService.saveEvent(event, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});

