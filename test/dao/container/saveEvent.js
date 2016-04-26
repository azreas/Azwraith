/**
 * 存容器事件信息
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var uuid = require('node-uuid');

var event = {
    containerid: uuid.v4(),
    title: "测试",
    titme: 1461579429939,
    script: ""
};
containerService.saveEvent(event, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});





































