/**
 * 保存容器配置
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var uuid = require('node-uuid');

var container = {
    id : uuid.v4(),
    appid: "7deed1db-7777-4de5-94ef-bf1b4af49eec",
    outaddress: {
        schema: "tcp",
        ip: "192.168.1.244",
        port: "32842"
    },
    inaddress: {
        schema: "tcp",
        ip: "10.0.116.11",
        port: "80"
    },
    name: "mycontainer",
    status: 2,
    createtime: 1461579403079
};
containerService.save(container, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});